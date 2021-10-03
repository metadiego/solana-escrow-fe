const BufferLayout = require('buffer-layout');

/**
 * Layout for a public key
 */
const publicKey = (property = "publicKey") => {
  return BufferLayout.blob(32, property);
};

/**
 * Layout for a 64bit unsigned value
 */
const uint64 = (property = "uint64") => {
  return BufferLayout.blob(8, property);
};

export const ESCROW_ACCOUNT_DATA_LAYOUT = BufferLayout.struct([
  BufferLayout.u8("isInitialized"),
  publicKey("initializerPubkey"),
  publicKey("initializerTempTokenAccountPubkey"),
  publicKey("responderTokenAccountPubkey"),
  uint64("questionBidAmountXTokens"),
  uint64("questionId"),
  uint64("questionDuration")
]);

export interface EscrowLayout {
  isInitialized: number,
  initializerPubkey: Uint8Array,
  initializerTempTokenAccountPubkey: Uint8Array,
  responderTokenAccountPubkey: Uint8Array,
  questionBidAmountXTokens: Uint8Array,
  questionId: Uint8Array,
  questionDuration: Uint8Array
}
