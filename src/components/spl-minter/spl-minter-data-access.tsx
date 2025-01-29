import { createMint, mintTo } from "@solana/spl-token"
import { useCluster } from "../cluster/cluster-data-access"
import { useMutation, useQuery } from '@tanstack/react-query'
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from '@solana/web3.js';
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";
import { useAnchorProvider } from "../solana/solana-provider";
const { cluster } = useCluster()
import { useTransactionToast } from "../ui/ui-layout";

export interface CreateMintArgs {
  mintAuthority: PublicKey
  freezeAuthority: PublicKey
}

interface MintTokenArgs {
  mint: PublicKey,
  destination: PublicKey,
  amount: number
}

export function useSplMinter() {

  const { connection } = useConnection()
  const { wallet } = useAnchorProvider()
  const payer = (wallet as NodeWallet).payer
  const transactionToast = useTransactionToast()

  const createMintAccount = useMutation<string, Error, CreateMintArgs>({

    mutationKey: ["createMint", "create", { cluster }],
    mutationFn: async (args: CreateMintArgs) => {
      const mintPubkey = await createMint(connection, payer, args.mintAuthority, args.freezeAuthority, 9)
      return mintPubkey.toBase58()
    },
    onSuccess: (mintAddress) => {
      transactionToast(mintAddress)
    },
    onError: (error) => {
      transactionToast(error.message)
    }
  })

  const mintTokens = useMutation<string, Error, MintTokenArgs>({
    mutationKey: ["mintTokens"],
    mutationFn: async ({ mint, destination, amount }: MintTokenArgs) => {
      const signature = await mintTo(
        connection,
        payer,
        mint,
        destination,
        payer,
        amount
      )
      return signature
    },
    onSuccess: (signature) => {
      transactionToast(`Tokens Minted! TX: ${signature}`)
    },
    onError: (error) => {
      transactionToast(`Minting Failed: ${error.message}`)
    }
  })

  return {
    createMintAccount,
    mintTokens
  }
}




