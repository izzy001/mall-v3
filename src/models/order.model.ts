import { Schema, model } from 'mongoose'
import { IOrderModel, PaymentStatus, OrderStatus } from '@/types/order'

const orderSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customer_first_name: {
      type: String,
      required: true,
    },
    customer_last_name: {
      type: String,
      required: true,
    },
    order_number: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: OrderStatus,
      default: OrderStatus.PENDING,
    },
    payment_status: {
      type: String,
      required: true,
      enum: PaymentStatus,
      default: PaymentStatus.UNPAID,
    },
    date: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    total_quantity: {
      type: Number,
      required: true,
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          required: true,
        },
        date_delivered: {
          type: Date,
          required: false,
        },
        status: {
          type: String,
          enum: Object.values(OrderStatus),
          default: OrderStatus.PENDING,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
)

export const Order = model<IOrderModel>('Order', orderSchema)
