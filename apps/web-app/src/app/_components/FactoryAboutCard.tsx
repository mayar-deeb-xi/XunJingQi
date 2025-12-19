'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/card';

export function FactoryAboutCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          The Factory contract is responsible for creating new ERC-20 token instances using the Beacon Proxy pattern. It manages access control
          through owner and admin roles, and can be paused by the owner to halt new token creation. All tokens created through this factory are
          upgradeable via the UpgradeableBeacon contract.
        </p>
      </CardContent>
    </Card>
  );
}

