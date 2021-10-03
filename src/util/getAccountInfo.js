import {Connection, PublicKey} from '@solana/web3.js';

const connection = new Connection("http://localhost:8899", 'singleGossip');

/**
 * Fetch information associated with an account.
 */
export async function getAccountInfo(accountId: string) {
  const publicKey = new PublicKey(accountId);
  const accountInfo = await connection.getAccountInfo(publicKey);
  return accountInfo;
}
