import { AccountLayout, Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { Account, Connection, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY, Transaction, TransactionInstruction } from "@solana/web3.js";
import BN from "bn.js";
import { ESCROW_ACCOUNT_DATA_LAYOUT, EscrowLayout } from "./layout";

const connection = new Connection("http://localhost:8899", 'singleGossip');

export const initEscrow = async (
    privateKeyByteArray: string,
    initializerXTokenAccountPubkeyString: string,
    escrowProgramIdString: string,
    questionId: number,
    questionBidAmountXTokens: number,
    questionDuration: number) => {

    /// Instruction: to create a temp token account for token X owned by token program.
    const privateKeyDecoded = privateKeyByteArray.split(',').map(s => parseInt(s));
    const initializerAccount = new Account(privateKeyDecoded);

    const tempTokenAccount = new Account();
    const createTempTokenAccountIx = SystemProgram.createAccount({
        programId: TOKEN_PROGRAM_ID,
        space: AccountLayout.span,
        lamports: await connection.getMinimumBalanceForRentExemption(AccountLayout.span, 'singleGossip'),
        fromPubkey: initializerAccount.publicKey,
        newAccountPubkey: tempTokenAccount.publicKey
    });

    const initializerXTokenAccountPubkey = new PublicKey(initializerXTokenAccountPubkeyString);

    //@ts-expect-error
    const XTokenMintAccountPubkey = new PublicKey((await connection.getParsedAccountInfo(initializerXTokenAccountPubkey, 'singleGossip')).value!.data.parsed.info.mint);

    const initTempAccountIx = Token.createInitAccountInstruction(TOKEN_PROGRAM_ID, XTokenMintAccountPubkey, tempTokenAccount.publicKey, initializerAccount.publicKey);

    /// Instruction: to transfer from initializer's X token account to the temp token account.
    const transferXTokensToTempAccIx = Token
        .createTransferInstruction(TOKEN_PROGRAM_ID, initializerXTokenAccountPubkey, tempTokenAccount.publicKey, initializerAccount.publicKey, [], questionBidAmountXTokens);

    /// Instruction: to create an account for use by the escrow.
    const escrowAccount = new Account();
    const escrowProgramId = new PublicKey(escrowProgramIdString);

    const createEscrowAccountIx = SystemProgram.createAccount({
        space: ESCROW_ACCOUNT_DATA_LAYOUT.span,
        lamports: await connection.getMinimumBalanceForRentExemption(ESCROW_ACCOUNT_DATA_LAYOUT.span, 'singleGossip'),
        fromPubkey: initializerAccount.publicKey,
        newAccountPubkey: escrowAccount.publicKey,
        programId: escrowProgramId
    });

    /// Instruction: initialize escrow instruction.
    const initEscrowIx = new TransactionInstruction({
        programId: escrowProgramId,
        keys: [
            { pubkey: initializerAccount.publicKey, isSigner: true, isWritable: false },
            { pubkey: tempTokenAccount.publicKey, isSigner: false, isWritable: true },
            { pubkey: escrowAccount.publicKey, isSigner: false, isWritable: true },
            { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        ],
        data: Buffer.from(
          Uint8Array.of(
            0,
            ...new BN(questionBidAmountXTokens).toArray("le", 8),
            ...new BN(questionId).toArray("le", 8),
            ...new BN(questionDuration).toArray("le", 8),
          )
        )
    })

    const tx = new Transaction()
        .add(createTempTokenAccountIx, initTempAccountIx, transferXTokensToTempAccIx, createEscrowAccountIx, initEscrowIx);
    await connection.sendTransaction(tx, [initializerAccount, tempTokenAccount, escrowAccount], {skipPreflight: false, preflightCommitment: 'singleGossip'});

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const encodedEscrowState = (await connection.getAccountInfo(escrowAccount.publicKey, 'singleGossip'))!.data;
    const decodedEscrowState = ESCROW_ACCOUNT_DATA_LAYOUT.decode(encodedEscrowState) as EscrowLayout;
    return {
        escrowAccountPubkey: escrowAccount.publicKey.toBase58(),
        isInitialized: !!decodedEscrowState.isInitialized,
        initializerAccountPubkey: new PublicKey(decodedEscrowState.initializerPubkey).toBase58(),
        XTokenTempAccountPubkey: new PublicKey(decodedEscrowState.initializerTempTokenAccountPubkey).toBase58(),
        questionId: new BN(decodedEscrowState.questionId, 8, "le").toNumber(),
        questionBidAmountXTokens: new BN(decodedEscrowState.questionBidAmountXTokens, 8, "le").toNumber(),
        questionDuration: new BN(decodedEscrowState.questionDuration, 8, "le").toNumber()
    };
}
