'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { ExplorerLink } from '../cluster/cluster-ui';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { useSplMinter } from './spl-minter-data-access';
import { CreateATA, CreateMint, MintTokens } from './spl-minter-ui';

export default function MinterFeature() {
  const { publicKey } = useWallet();

  return publicKey ? (
    <div>
      <AppHero
        title="Minter"
        subtitle={'Run the program by clicking the "Run program" button.'}
      >
        <CreateMint />
      </AppHero>
      <MintTokens />
      <CreateATA />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton className="btn btn-primary" />
        </div>
      </div>
    </div>
  );
}
