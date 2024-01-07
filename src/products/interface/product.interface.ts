import { Document } from 'mongoose';

export interface Product extends Document {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly stock: number;
  readonly supplier: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
}
