import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { useSplMinter } from "./spl-minter-data-access";
import { useWallet } from "@solana/wallet-adapter-react";

export function CreateMint() {

  const { createMintAccount } = useSplMinter()
  const [mintAuthorityAddress, setMintAuthorityAdderess] = useState<string>("")
  const [freezeAuthorityAddress, setFreezeAuthorityAddress] = useState<string>("")
  const { publicKey } = useWallet()

  const isFormValid = mintAuthorityAddress.trim() && freezeAuthorityAddress.trim()

  const handleSumbit = () => {
    if (publicKey && isFormValid) {
      const mintAuthority = new PublicKey(mintAuthorityAddress)
      const freezeAuthority = new PublicKey(freezeAuthorityAddress)
      createMintAccount.mutateAsync({ mintAuthority, freezeAuthority })
    }
  }

  if (!publicKey) {
    return (
      <p>Connect your wallet</p>
    )
  }
  return (
    <div>
      <h1>CreateMint</h1>

      <input type="text" placeholder='MintAuthorityAddress' value={mintAuthorityAddress}
        className='input input-bordered w-full max-w-xs'
        onChange={(e) => setMintAuthorityAdderess(e.target.value)} />

      <input type="text" placeholder='freezeAuthorityAddress' value={freezeAuthorityAddress}
        className='input input-bordered w-full max-w-xs'
        onChange={(e) => setFreezeAuthorityAddress(e.target.value)} />

      <button onClick={handleSumbit}
        disabled={createMintAccount.isPending || !isFormValid}
        className='btn btn-xs lg: btn-md btn-primary' >
        Submit
      </button>
    </div>
  )
}

export function MintTokens() {

  const { mintTokens } = useSplMinter()
  const [mintAddress, setMintAddress] = useState<string>("")
  const [destinationAddress, setDestinationAddress] = useState<string>("")
  const [amount, setAmount] = useState(0)
  const { publicKey } = useWallet()

  const isFormValid = mintAddress.trim() && destinationAddress.trim() && (amount > 0)

  const handleSumbit = () => {
    if (publicKey && isFormValid) {
      const mint = new PublicKey(mintAddress)
      const destination = new PublicKey(destinationAddress)
      mintTokens.mutateAsync({ mint, destination, amount })
    }
  }

  if (!publicKey) {
    return (
      <p>Connect your wallet</p>
    )
  }
  return (
    <div>
      <h2 className="">TokenTransfer</h2>

      <input type="text" placeholder='MintAuthorityAddress' value={mintAddress}
        className='input input-bordered w-full max-w-xs'
        onChange={(e) => setMintAddress(e.target.value)} />

      <input placeholder='destinationAddress' value={destinationAddress}
        className='input input-bordered w-full max-w-xs'
        onChange={(e) => setDestinationAddress(e.target.value)} />

      <input type="number" placeholder='amount' value={amount}
        className='input input-bordered w-full max-w-xs'
        onChange={(e) => setAmount(Number(e.target.value))} />

      <button onClick={handleSumbit}
        disabled={mintTokens.isPending || !isFormValid}
        className='btn btn-xs lg: btn-md btn-primary' />

    </div>
  )
}
