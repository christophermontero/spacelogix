import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      minLength: 3,
      maxLength: 255,
      required: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxLength: 255,
      required: true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      trim: true,
      lowercase: true,
      maxLength: 255
    },
    address: {
      type: String,
      trim: true,
      lowercase: true,
      maxLength: 255
    },
    city: {
      type: String,
      trim: true,
      lowercase: true,
      maxLength: 255
    },
    country: {
      type: String,
      trim: true,
      lowercase: true,
      maxLength: 255
    },
    role: {
      type: String,
      trim: true,
      lowercase: true,
      maxLength: 255
    }
  },
  { timestamps: true }
);
