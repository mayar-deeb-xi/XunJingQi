import { OracleList } from './_components/OracleList';
import { TokenRateSelector } from './_components/TokenRateSelector';

export default function Page() {
  return (
    <div className="p-4 md:p-6 flex-1 space-y-6">
      <TokenRateSelector />
      <OracleList />
    </div>
  );
}
