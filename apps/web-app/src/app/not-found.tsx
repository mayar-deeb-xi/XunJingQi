'use client';

import { Button } from '@acme/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center p-4 md:p-6">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <h2 className="text-xl font-semibold">Page Not Found</h2>
          <p className="max-w-md text-sm text-muted-foreground">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="default">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
