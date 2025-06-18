const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    description: {
      type: String,
      default: "No description provided"
    },

    category: {
      type: String,
      default: "General"
    },

    stock: {
      type: Number,
      default: 100
    },

    image: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    },

    // 🛒 Orders placed for this product (used by all portals for tracking)
    orders: [
      {
        customerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Customer'
        },
        customerName: String,
        address: String,
        phone: String,
        quantity: {
          type: Number,
          default: 1
        },
        status: {
          type: String,
          enum: ['Pending', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'],
          default: 'Pending'
        },
        trackingId: {
          type: String,
          default: ''
        },
        orderedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
