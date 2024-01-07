import * as mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    currency: String,
    stock: Number,
    supplier: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      country: String
    }
  },
  { timestamps: true }
);

// Define index on supplier.email
ProductSchema.index({ 'supplier.email': 1 });

export default ProductSchema;
