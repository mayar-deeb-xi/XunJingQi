import { Type } from 'class-transformer';
import {
  IsEnum,
  IsEthereumAddress,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export enum QuoteTradeType {
  EXACT_INPUT = 'EXACT_INPUT',
  EXACT_OUTPUT = 'EXACT_OUTPUT',
}

export class TokenInputDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'address must be a valid hex address',
  })
  address: string;
}

export class QuoteRequestDto {
  @IsInt()
  @Min(1)
  chainId: number;

  @ValidateNested()
  @Type(() => TokenInputDto)
  fromToken: TokenInputDto;

  @ValidateNested()
  @Type(() => TokenInputDto)
  toToken: TokenInputDto;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d*\.?\d+$/, {
    message: 'amount must be a positive number',
  })
  amount: string;

  @IsEnum(QuoteTradeType)
  @IsOptional()
  tradeType?: QuoteTradeType;

  @IsEthereumAddress()
  recipient: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(10_000)
  slippageToleranceBps?: number;

  @IsOptional()
  @IsInt()
  @Min(60)
  deadlineSeconds?: number;
}
