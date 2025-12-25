'use client';
import { useAccount, useChainId, useSwitchChain } from 'wagmi';

import { Button } from '@acme/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@acme/ui/dropdown-menu';
import { Check, Network } from 'lucide-react';

export const ChainsMenu = () => {
  const chainId = useChainId();

  const { isConnecting, isReconnecting } = useAccount();

  const { chains, switchChain } = useSwitchChain();

  const isLoading = isConnecting || isReconnecting;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isLoading}>
          <Button variant="ghost" className="px-2 hover:underline ">
            <Network />

            <span className="hidden sm:block"> {chains.find((el) => el.id == chainId)?.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {chains.map((chain) => (
            <DropdownMenuItem key={chain.id} onClick={() => switchChain({ chainId: chain.id })}>
              {chain.name}
              {chain.id === chainId && <Check />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
