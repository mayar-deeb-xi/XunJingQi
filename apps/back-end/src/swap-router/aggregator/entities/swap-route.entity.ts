import { RouterName } from '../../../enums';
import { FormattedSwapRoute } from '../../../types';

export class SwapRouteEntity {
  router: RouterName;
  route: FormattedSwapRoute;

  constructor(partial: Partial<SwapRouteEntity>) {
    Object.assign(this, partial);
  }
}
