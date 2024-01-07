import { Document } from 'mongoose';

export interface Product extends Document {
  name: string;
  description: string;
  price: number;
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
