import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Account, Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";

export const cancelEscrow = async (
    connection: Connection,
    initializerPrivateKeyByteArray: string,
    initializerTempTokenAccountPubkeyString: string,
    escrowTempTokenAccountPubkeyString: string,
    escrowAccountPubkeyString: string,
    escrowProgramIdString: string,
    initializerQuestionId: number,
    initializerQuestionBidAmount: number) => {

    const initializerPrivateKeyByteArrayDecoded = initializerPrivateKeyByteArray.split(',').map(s => parseInt(s));
    const initializerAccount = new Account(initializerPrivateKeyByteArrayDecoded);

    const escrowProgramId = new PublicKey(escrowProgramIdString);
    const PDA = await PublicKey.findProgramAddress([Buffer.from("escrow")], escrowProgramId);

    /// Instruction: cancel escrow instruction.
    const cancelEscrowIx = new TransactionInstruction({
        programId: escrowProgramId,
        data: Buffer.from(
          Uint8Array.of(
            2,
            ...new BN(initializerQuestionId).toArray("le", 8),
          )
        ),
        keys: [
            { pubkey: initializerAccount.publicKey, isSigner: true, isWritable: false },
            { pubkey: new PublicKey(escrowTempTokenAccountPubkeyString), isSigner: false, isWritable: true },
            { pubkey: new PublicKey(initializerTempTokenAccountPubkeyString), isSigner: false, isWritable: true },
            { pubkey: new PublicKey(escrowAccountPubkeyString), isSigner: false, isWritable: true },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false},
            { pubkey: PDA[0], isSigner: false, isWritable: false}
        ]
    });

    await connection.sendTransaction(
      new Transaction().add(cancelEscrowIx),
       [initializerAccount],
       {skipPreflight: false, preflightCommitment: 'singleGossip'});

    // await new Promise((resolve) => setTimeout(resolve, 1000));
    //
    // const encodedEscrowState = (await connection.getAccountInfo(escrowAccount.publicKey, 'singleGossip'))!.data;
    // const decodedEscrowState = ESCROW_ACCOUNT_DATA_LAYOUT.decode(encodedEscrowState) as EscrowLayout;
    //
    // return {
    //     escrowAccountPubkey: escrowAccount.publicKey,
    //     isInitialized: !!decodedEscrowState.isInitialized,
    //     initializerAccountPubkey: new PublicKey(decodedEscrowState.initializerPubkey),
    //     tempTokenAccountPubkey: new PublicKey(decodedEscrowState.tempTokenAccountPubkey),
    //     questionId: new BN(decodedEscrowState.questionId, 8, "le").toNumber(),
    //     questionBidAmountXTokens: new BN(decodedEscrowState.questionBidAmountXTokens, 8, "le").toNumber(),
    //     questionDuration: new BN(decodedEscrowState.questionDuration, 8, "le").toNumber()
    // };
}
