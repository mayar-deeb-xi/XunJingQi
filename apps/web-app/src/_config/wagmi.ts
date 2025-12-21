import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { env } from '~/env';

export const getConfig = () => {
  return createConfig({
    chains: [
      mainnet,
      // sepolia,
    ],
    transports: {
      [mainnet.id]: http(`https://eth-mainnet.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
      // [sepolia.id]: http(`https://eth-sepolia.g.alchemy.com/v2/${env.NEXT_PUBLIC_ALCHEMY_API_KEY}`),
    },
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
  });
};

// will be used to check if the transaction is confirmed
export const CONFIRMATION_BLOCK_COUNT = 12;
