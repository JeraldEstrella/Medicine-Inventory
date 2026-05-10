import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'Others',
    },
    qty: {
      type: Number,
      default: 0,
    },
    minStock: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      default: 'tabs',
    },
    expiry: {
      type: Date,
      default: null,
    },
    supplier: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Medicine', medicineSchema);
