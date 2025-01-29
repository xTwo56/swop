'use client';

import { useConnection } from '@solana/wallet-adapter-react'
import { useMutation, useQuery } from '@tanstack/react-query'

import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'
import { createMint } from '@solana/spl-token';

export function useSwapProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();

  const createMint = useMutation({
    mutationKey: ['spl-minter', 'createMint', { cluster }],
    mutationFn: () => {
      const mint = await createMint(
        connection,
        payer,
        mintAuthority.publicKey,
        freezeAuthority.publicKey,
        9
      );
    },
    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: () => toast.error('Failed to run program'),
  });

  return {
    programId,
    getProgramAccount,
    createMint
  }
};
