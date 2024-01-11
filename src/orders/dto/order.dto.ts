import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested
} from 'class-validator';
import { SupplierDto } from '../../products/dto/index';
import { Currency, PaymentMethod } from '../interface/order.interface';

class BillingAddressDto {
  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  zipCode: string;
}

class CustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;
}

class TransporterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}

class PaymentDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsString()
  @IsOptional()
  cardNumber: string;

  @IsString()
  @IsOptional()
  expirationDate: string;

  @IsString()
  @IsOptional()
  cvv: string;

  @ValidateNested()
  @Type(() => BillingAddressDto)
  billingAddress: BillingAddressDto;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  totalAmount: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(Currency)
  currency: Currency;
}

export class ProductOrderDto {
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

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;

  @ValidateNested()
  @IsOptional()
  @Type(() => SupplierDto)
  supplier: SupplierDto;
}

export class OrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOrderDto)
  products: ProductOrderDto[];

  @ValidateNested()
  @Type(() => CustomerDto)
  @IsOptional()
  customer: CustomerDto;

  @ValidateNested()
  @Type(() => TransporterDto)
  transporter: TransporterDto;

  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;
}
