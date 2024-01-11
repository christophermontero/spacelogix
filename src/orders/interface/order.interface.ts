import { Document } from 'mongoose';

export enum PaymentMethod {
  CreditCard = 'credit',
  PayPayl = 'paypal'
}

export enum Currency {
  COP = 'cop',
  USD = 'usd',
  EUR = 'eur'
}

interface BillingAddress {
  country: string;
  city: string;
  address: string;
  zipCode: string;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

interface Transporter {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

interface Payment {
  paymentMethod: PaymentMethod;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  billingAddress: BillingAddress;
  totalAmount: number;
  currency: string;
}

interface ProductOrder extends Document {
  name: string;
  description?: string;
  price: number;
  currency: Currency;
  supplier: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
}

export interface Order extends Document {
  products: ProductOrder[];
  customer: Customer;
  transporter: Transporter;
  payment: Payment;
}
