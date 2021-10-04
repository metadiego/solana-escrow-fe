import {Connection, PublicKey} from '@solana/web3.js';

export const buildLocalConnection = () => new Connection("http://localhost:8899", 'singleGossip');

export const buildDevConnection = () => new Connection("https://api.devnet.solana.com", 'singleGossip');

/**
 * Fetch information associated with an account.
 */
export async function getInfoForAccount(connection: Connection, publicKeyString: string) {
  const accountInfo = await connection.getAccountInfo(new PublicKey(publicKeyString));
  return accountInfo;
}

/**
 * Fetch information associated with a token account.
 */
export async function getInfoForTokenAccount(connection: Connection, publicKeyString: string) {
  const accountInfo = await connection.getTokenAccountBalance(new PublicKey(publicKeyString));
  return accountInfo;
}
