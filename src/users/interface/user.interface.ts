import { Document } from 'mongoose';

export enum UserRole {
  Customer = 'customer',
  Supplier = 'supplier',
  Transporter = 'transporter'
}

export interface User extends Document {
  readonly name: string;
  readonly email: string;
  readonly hashedPassword: string;
  readonly role: UserRole;
  readonly phone?: string;
  readonly address?: string;
  readonly city?: string;
  readonly country?: string;
}
