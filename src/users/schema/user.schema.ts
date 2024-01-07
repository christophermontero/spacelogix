import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    hashedPassword: String,
    phone: String,
    address: String,
    city: String,
    country: String,
    role: String
  },
  { timestamps: true }
);
