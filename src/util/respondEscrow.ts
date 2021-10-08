import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Account, Connection, PublicKey, Transaction, TransactionInstruction, SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js";
import BN from "bn.js";
import { ESCROW_ACCOUNT_DATA_LAYOUT, EscrowLayout } from "./layout";

export const respond = async (
    connection: Connection,
    privateKeyByteArray: string,
    responderXTokenAccountAddressString: string,
    responderExpectedXTokenAmount: number,
    responderQuestionId: number,
    escrowAccountAddressString: string,
    escrowProgramIdString: string
) => {
    const responderAccount = new Account(privateKeyByteArray.split(',').map(s => parseInt(s)));
    const escrowAccountPubkey = new PublicKey(escrowAccountAddressString);
    const responderXTokenAccountPubkey = new PublicKey(responderXTokenAccountAddressString);
    const escrowProgramId = new PublicKey(escrowProgramIdString);

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
        tempTokenAccountPubkey: new PublicKey(decodedEscrowLayout.tempTokenAccountPubkey),
        questionBidAmount: new BN(decodedEscrowLayout.questionBidAmountXTokens, 8, "le"),
        escrowInitTime: new BN(decodedEscrowLayout.escrowInitTimeStamp, 8, "le"),
    };
    console.log("Escrow state successfuly fetched:");
    console.log(escrowState);

    const PDA = await PublicKey.findProgramAddress([Buffer.from("escrow")], escrowProgramId);

    const respondInstruction = new TransactionInstruction({
        programId: escrowProgramId,
        data: Buffer.from(
          Uint8Array.of(
            1,
            ...new BN(responderExpectedXTokenAmount).toArray("le", 8),
            ...new BN(responderQuestionId).toArray("le", 8),
            ...new BN(0).toArray("le", 8),
            ...new BN(0).toArray("le", 8),
          )
        ),
        keys: [
            { pubkey: responderAccount.publicKey, isSigner: true, isWritable: false },
            { pubkey: responderXTokenAccountPubkey, isSigner: false, isWritable: true },
            { pubkey: escrowState.tempTokenAccountPubkey, isSigner: false, isWritable: true},
            { pubkey: escrowState.initializerAccountPubkey, isSigner: false, isWritable: true},
            { pubkey: escrowAccountPubkey, isSigner: false, isWritable: true },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
            { pubkey: PDA[0], isSigner: false, isWritable: false},
            { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
        ]
    })

    await connection.sendTransaction(
      new Transaction().add(respondInstruction), [responderAccount], {skipPreflight: false, preflightCommitment: 'singleGossip'});
}
