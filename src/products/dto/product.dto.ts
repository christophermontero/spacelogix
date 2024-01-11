import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested
} from 'class-validator';
import { Currency } from '../interface/product.interface';

export class SupplierDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  country: string;
}

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  stock: number;

  @ValidateNested()
  @IsOptional()
  @Type(() => SupplierDto)
  supplier: SupplierDto;
}

export class EditProductDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price: number;

  @IsOptional()
  @IsEnum(Currency)
  currency: Currency;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  stock: number;
}
