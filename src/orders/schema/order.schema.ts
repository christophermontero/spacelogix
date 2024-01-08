import * as mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    customer: {
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
        required: true
      },
      address: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 255,
        required: true
      },
      city: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 255,
        required: true
      },
      country: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 255,
        required: true
      }
    },
    transporter: {
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
        maxLength: 255,
        required: true
      },
      address: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 255,
        required: true
      },
      city: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 255,
        required: true
      },
      country: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 255,
        required: true
      }
    },
    payment: {
      paymentMethod: {
        type: String,
        trim: true,
        lowercase: true,
        maxLength: 255,
        required: true
      },
      cardNumber: {
        type: String,
        trim: true,
        maxLength: 255
      },
      expirationDate: {
        type: String,
        trim: true,
        maxLength: 255
      },
      cvv: {
        type: String,
        trim: true,
        minLength: 3,
        maxLength: 5
      },
      billingAddress: {
        country: {
          type: String,
          trim: true,
          lowercase: true,
          maxLength: 255,
          required: true
        },
        city: {
          type: String,
          trim: true,
          lowercase: true,
          maxLength: 255,
          required: true
        },
        address: {
          type: String,
          trim: true,
          lowercase: true,
          maxLength: 255,
          required: true
        },
        zipCode: {
          type: String,
          trim: true,
          lowercase: true,
          maxLength: 255
        }
      },
      totalAmount: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 5,
        required: true
      }
    }
  },
  { timestamps: true }
);

// Define index on customer.email
OrderSchema.index({ 'customer.email': 1 });
// Define index on transporter.email
OrderSchema.index({ 'transporter.email': 1 });

export default OrderSchema;
