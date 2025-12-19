'use client';

import { WagmiProvider as _WagmiProvider, State } from 'wagmi';
import { JSX, useState } from 'react';
import { getConfig } from '~/_config/wagmi';

type WagmiProviderProps = {
  children: JSX.Element;
  initialState?: State | undefined;
};

export const WagmiProvider = ({ children, initialState }: WagmiProviderProps) => {
  const [config] = useState(getConfig());

  return (
    <_WagmiProvider initialState={initialState} config={config}>
      {children}
    </_WagmiProvider>
  );
};
