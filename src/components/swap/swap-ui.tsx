'use client';

import { useSwapProgram } from './swap-data-access'

export function SwapCreate() {
  const { greet } = useSwapProgram();

  return (
    <button
      className="btn btn-xs lg:btn-md btn-primary"
      onClick={() => greet.mutateAsync()}
      disabled={greet.isPending}
    >
      Run program{greet.isPending && '...'}
    </button>
  );
}

export function SwapProgram() {
  const { getProgramAccount } = useSwapProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={'space-y-6'}>
      <pre>{JSON.stringify(getProgramAccount.data.value, null, 2)}</pre>
    </div>
  );
}
