export class TokenEntity {
  address: string;
  symbol: string;
  name: string;
  decimals: number;

  constructor(partial: Partial<TokenEntity>) {
    Object.assign(this, partial);
  }
}
