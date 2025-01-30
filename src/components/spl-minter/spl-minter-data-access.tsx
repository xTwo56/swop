import { createMintToInstruction, createMint, getMinimumBalanceForRentExemptMint, createInitializeMint2Instruction, TOKEN_PROGRAM_ID, mintTo, getOrCreateAssociatedTokenAccount, getAssociatedTokenAddressSync, MINT_SIZE, createInitializeAccountInstruction, createAssociatedTokenAccount, createAssociatedTokenAccountInstruction } from "@solana/spl-token"
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
  mintAuthority: PublicKey,
  destination: PublicKey,
  amount: number
}

interface CreateATAargs {

  mint: PublicKey,
  destination: PublicKey
}

export function useSplMinter() {

  const { cluster } = useCluster()
  const connection = new Connection(cluster.endpoint)
  const provider = useAnchorProvider()
  const { sendTransaction, publicKey } = useWallet()
  const transactionToast = useTransactionToast()
  if (!publicKey) throw new Error("publickey not defined")

  const createMintAccount = useMutation<string, Error, CreateMintArgs>({

    mutationKey: ["Minter", "create", { cluster }],
    mutationFn: async (args: CreateMintArgs) => {

      const mint = Keypair.generate()
      const lamports = await getMinimumBalanceForRentExemptMint(connection);


      const transaction = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mint.publicKey,
          space: MINT_SIZE,
          lamports,
          programId: TOKEN_PROGRAM_ID
        }),
        createInitializeMint2Instruction(mint.publicKey, 9, args.mintAuthority, args.freezeAuthority),
      );

      const signature = await sendTransaction(transaction, connection, {
        signers: [mint]
      })
      await connection.confirmTransaction(signature, "confirmed");
      console.log("mint: " + mint.publicKey)
      return signature
    },
    onSuccess: (signature) => {
      transactionToast(signature)
    },
    onError: (error) => {
      transactionToast(error.message)
    }
  })

  const createATA = useMutation<string, Error, CreateATAargs>({

    mutationKey: ["Minter", "createATA", { cluster }],
    mutationFn: async ({ mint, destination }: CreateATAargs) => {
      const ata = getAssociatedTokenAddressSync(mint, destination)

      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(publicKey, ata, destination, mint)
      )

      const signature = await sendTransaction(transaction, connection)

      await connection.confirmTransaction(signature, "confirmed")

      return ata.toBase58()
    },
    onSuccess: (ataAddress) => {
      transactionToast(ataAddress)
      console.log(ataAddress)
    },
    onError: (error) => {
      transactionToast(error.message)
    }
  })


  const mintTokens = useMutation<string, Error, MintTokenArgs>({
    mutationKey: ["Minter", "mint", { cluster }],
    mutationFn: async ({ mint, destination, mintAuthority, amount }: MintTokenArgs) => {


      const ATA_SIZE = 165
      const ata = getAssociatedTokenAddressSync(mint, destination)
      const transaction = new Transaction().add(
        createMintToInstruction(mint, ata, mintAuthority, amount),
      );

      const signature = await sendTransaction(transaction, connection)
      await connection.confirmTransaction(signature, "confirmed");

      return ata.toBase58()
    },
    onSuccess: (ataAddress) => {
      transactionToast(`Tokens Minted! TX: ${ataAddress}`)
    },
    onError: (error) => {
      transactionToast(`Minting Failed: ${error.message}`)
    }
  })

  return {
    createMintAccount,
    createATA,
    mintTokens
  }
}

