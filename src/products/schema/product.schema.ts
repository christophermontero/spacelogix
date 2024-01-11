import * as mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      lowercase: true,
      minLength: 3,
      maxLength: 255,
      required: true
    },
    description: {
      type: String,
      trim: true,
      lowercase: true,
      minLength: 3,
      maxLength: 255,
      required: true
    },
    price: {
      type: Number,
      trim: true,
      required: true
    },
    currency: {
      type: String,
      trim: true,
      lowercase: true,
      minLength: 3,
      maxLength: 255,
      required: true
    },
    stock: {
      type: Number,
      trim: true,
      required: true
    },
    supplier: {
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
      }
    }
  },
  { timestamps: true }
);

// Define index on name
ProductSchema.index({ name: 1 }, { unique: true });
// Define index on supplier.email
ProductSchema.index({ 'supplier.email': 1 });

export default ProductSchema;
