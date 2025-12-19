'use client';
// Since QueryClientProvider relies on useContext under the hood, we have to put 'use client' on top
import { toast } from '@acme/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { JSX } from 'react';

// function makeQueryClient() {
//   return new QueryClient({
//     defaultOptions: {
//       queries: {
//         // With SSR, we usually want to set some default staleTime
//         // above 0 to avoid refetching immediately on the client
//         // staleTime: 60 * 1000,
//       },
//     },
//   });
// }

const client = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError(error) {
        toast.error(`${(error as unknown as Record<string, string>).shortMessage ?? error.name}`, {
          description: `${(typeof error?.cause === 'string' ? error?.cause : '') ?? error.name}`,
          action: {
            label: 'Close',
            onClick: () => {},
          },
        });

        return false;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError(error) {
        if (error instanceof AxiosError) {
          toast.error(error.message, {
            description: error.response?.data.message.join(', '),
            action: {
              label: 'Close',
              onClick: () => {},
            },
          });
        } else {
          toast.error(`${(error as unknown as Record<string, string>).shortMessage ?? error.message}`, {
            description: `${(typeof error?.cause === 'string' ? error?.cause : '') ?? error.name}`,
            action: {
              label: 'Close',
              onClick: () => {},
            },
          });
        }
      },
    },
  },
});

// let browserQueryClient: QueryClient | undefined = undefined;

// function getQueryClient() {
//   if (isServer) {
//     // Server: always make a new query client
//     return makeQueryClient();
//   } else {
//     // Browser: make a new query client if we don't already have one
//     // This is very important, so we don't re-make a new client if React
//     // suspends during the initial render. This may not be needed if we
//     // have a suspense boundary BELOW the creation of the query client
//     if (!browserQueryClient) browserQueryClient = makeQueryClient();
//     return browserQueryClient;
//   }
// }

export const ReactQueryProvider = ({ children }: { children: JSX.Element }) => {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  // const queryClient = getQueryClient();

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};
