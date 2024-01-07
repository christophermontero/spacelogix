import * as mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
  supplier: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    country: String
  }
});

// Define index on supplier.email
ProductSchema.index({ 'supplier.email': 1 });

export default ProductSchema;
