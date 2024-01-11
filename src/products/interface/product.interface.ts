import { Document } from 'mongoose';

export enum Currency {
  COP = 'cop',
  USD = 'usd',
  EUR = 'eur'
}

export interface Product extends Document {
  name: string;
  description?: string;
  price: number;
  currency: Currency;
  stock: number;
  supplier: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
}
