import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@acme/ui/breadcrumb';
import { Separator } from '@acme/ui/separator';
import { SidebarTrigger } from '@acme/ui/sidebar';
import { ModeToggle } from '~/_components/common/ModeToggle';
import { ChainsMenu } from '../common/ChainsMenu';
import { ConnectWallet } from '../common/ConnectWallet';

export const AppHeader = () => {
  return (
    <section className="py-2 sticky top-0 bg-blur-3xl backdrop-blur-md border-b border-foreground/20 border-dashed z-50  ">
      <div className="flex items-center justify-between gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb className="  flex-1">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage></BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <ChainsMenu />
        <ConnectWallet />
        <ModeToggle />
      </div>
    </section>
  );
};
