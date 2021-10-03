import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Account, Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import { ESCROW_ACCOUNT_DATA_LAYOUT, EscrowLayout } from "./layout";

const connection = new Connection("http://localhost:8899", 'singleGossip');

export const respond = async (
    privateKeyByteArray: string,
    escrowAccountAddressString: string,
    responderXTokenAccountAddressString: string,
    responderExpectedXTokenAmount: number,
    programIdString: string,
    questionId: number
) => {
    const responderAccount = new Account(privateKeyByteArray.split(',').map(s => parseInt(s)));
    const escrowAccountPubkey = new PublicKey(escrowAccountAddressString);
    const responderXTokenAccountPubkey = new PublicKey(responderXTokenAccountAddressString);
    const programId = new PublicKey(programIdString);

    let encodedEscrowState;
    try {
        encodedEscrowState = (await connection.getAccountInfo(escrowAccountPubkey, 'singleGossip'))!.data;
    } catch (err) {
        throw new Error("Could not find escrow at given address!")
    }
    const decodedEscrowLayout = ESCROW_ACCOUNT_DATA_LAYOUT.decode(encodedEscrowState) as EscrowLayout;
    const escrowState =  {
        escrowAccountPubkey: escrowAccountPubkey,
        isInitialized: !!decodedEscrowLayout.isInitialized,
        initializerAccountPubkey: new PublicKey(decodedEscrowLayout.initializerPubkey),
        XTokenTempAccountPubkey: new PublicKey(decodedEscrowLayout.initializerTempTokenAccountPubkey),
        questionBidAmount: new BN(decodedEscrowLayout.questionBidAmountXTokens, 8, "le")
    };

    const PDA = await PublicKey.findProgramAddress([Buffer.from("escrow")], programId);

    const respondInstruction = new TransactionInstruction({
        programId,
        data: Buffer.from(
          Uint8Array.of(
            1,
            ...new BN(responderExpectedXTokenAmount).toArray("le", 8),
            ...new BN(questionId).toArray("le", 8)
          )
        ),
        keys: [
            { pubkey: responderAccount.publicKey, isSigner: true, isWritable: false },
            { pubkey: responderXTokenAccountPubkey, isSigner: false, isWritable: true },
            { pubkey: escrowState.XTokenTempAccountPubkey, isSigner: false, isWritable: true},
            { pubkey: escrowState.initializerAccountPubkey, isSigner: false, isWritable: true},
            { pubkey: escrowAccountPubkey, isSigner: false, isWritable: true },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
            { pubkey: PDA[0], isSigner: false, isWritable: false}
        ]
    })

    await connection.sendTransaction(
      new Transaction().add(respondInstruction), [responderAccount], {skipPreflight: false, preflightCommitment: 'singleGossip'});
}
