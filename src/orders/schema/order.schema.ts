import * as mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    customer: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      country: String
    },
    transporter: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      country: String
    },
    payment: {
      paymentMethod: String,
      cardNumber: String,
      expirationDate: String,
      cvv: String,
      billingAddress: {
        country: String,
        city: String,
        address: String,
        zipCode: String
      },
      totalAmount: Number,
      currency: String
    }
  },
  { timestamps: true }
);

// Define index on customer.email
OrderSchema.index({ 'customer.email': 1 });
// Define index on transporter.email
OrderSchema.index({ 'transporter.email': 1 });

export default OrderSchema;
