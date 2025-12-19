'use client';

import React from 'react';
import { Connector, useAccount, useConnect, useDisconnect } from 'wagmi';
import { Button } from '@acme/ui/button';

import { LogOut, Wallet } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@acme/ui/dropdown-menu';

function WalletOption({ connector, onClick }: { connector: Connector; onClick: () => void }) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <DropdownMenuItem disabled={!ready} onClick={onClick}>
      {connector.name}
    </DropdownMenuItem>
  );
}

export const ConnectWallet = () => {
  const { connectors, connect } = useConnect();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" className="px-2">
          <Wallet />
          {isConnected ? (
            <span className="font-sans">
              {address?.slice(0, 4)}...{address?.slice(-4)}
            </span>
          ) : (
            <>
              <span className=""> Connect</span>
              <span className="hidden sm:block">Wallet</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {isConnected ? (
          <>
            <DropdownMenuItem>Wallet</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => disconnect()}>
              <LogOut />
              Disconnect
            </DropdownMenuItem>
          </>
        ) : (
          <>
            {connectors.map((connector) => (
              <WalletOption key={connector.uid} connector={connector} onClick={() => connect({ connector })} />
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
