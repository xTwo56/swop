import { createMint, getMinimumBalanceForRentExemptMint, createInitializeMint2Instruction, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from "@solana/spl-token"
import { useCluster } from "../cluster/cluster-data-access"
import { useMutation, useQuery } from '@tanstack/react-query'
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from '@solana/web3.js';
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";
import { SystemProgram, Keypair, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";

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

  const MINT_SIZE = 82
  const { cluster } = useCluster()
  const connection = new Connection(cluster.endpoint)
  const provider = useAnchorProvider()

  const transactionToast = useTransactionToast()

  const createMintAccount = useMutation<string, Error, CreateMintArgs>({

    mutationKey: ["Minter", "create", { cluster }],
    mutationFn: async (args: CreateMintArgs) => {

      const mint = Keypair.generate()
      const lamports = await getMinimumBalanceForRentExemptMint(connection);

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey: mint.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID
        }),
        createInitializeMint2Instruction(mint.publicKey, 9, args.mintAuthority, args.freezeAuthority),
      );

      return await provider.sendAndConfirm(transaction, [mint])
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      console.log(signature)
    },
    onError: (error) => {
      transactionToast(error.message)
    }
  })

  const mintTokens = useMutation<string, Error, MintTokenArgs>({
    mutationKey: ["Minter", "mint", { cluster }],
    mutationFn: async ({ mint, destination, amount }: MintTokenArgs) => {
      return setTimeout(() => "hello", 1)
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

