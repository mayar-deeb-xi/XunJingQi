import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/card';
import { SwapOrderForm } from './_components/SwapOrderForm/SwapOrderForm';

export default function Page() {
  return (
    <div className="p-4 md:p-6 flex-1 flex justify-center space-y-6">
      <Card className=" min-w-[600px]">
        <CardHeader>
          <CardTitle>Swap</CardTitle>
        </CardHeader>
        <CardContent>
          <SwapOrderForm />
        </CardContent>
      </Card>
    </div>
  );
}
