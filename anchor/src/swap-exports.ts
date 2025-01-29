// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { PublicKey } from '@solana/web3.js'
import SwapIDL from '../target/idl/swap.json'
import type { Swap } from '../target/types/swap'

// Re-export the generated IDL and type
export { Swap, SwapIDL }

// The programId is imported from the program IDL.
export const SWAP_PROGRAM_ID = new PublicKey(SwapIDL.address)

// This is a helper function to get the Swap Anchor program.
export function getSwapProgram(provider: AnchorProvider) {
  return new Program(SwapIDL as Swap, provider)
}
