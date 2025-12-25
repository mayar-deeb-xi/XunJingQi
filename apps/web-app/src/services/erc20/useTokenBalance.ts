import { Address, formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';

const NATIVE_ETH_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' as Address;

export const useTokenBalance = (token?: Address) => {
  const { address: userAddress } = useAccount();

  // Check if token is native ETH address - if so, don't pass token parameter
  const isNativeETH = token === NATIVE_ETH_ADDRESS;

  const q = useBalance({
    address: userAddress,
    token: isNativeETH ? undefined : token,
    query: { enabled: !!token },
  });

  const formatBalance = () => {
    if (!!!token) {
      return '0.0';
    }
    if (!q.data?.value || !q.data?.decimals) return '0.0';
    try {
      const formatted = formatUnits(q.data.value, q.data.decimals);
      // Remove trailing zeros and unnecessary decimal point
      return parseFloat(formatted).toString();
    } catch {
      return '0.0';
    }
  };

  return { ...q, formatBalance };
};
