import { Document } from 'mongoose'

export enum OrderStatus {
  SHIPPED = 'shipped',
  PENDING = 'pending',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PAID = 'paid',
  UNPAID = 'unpaid',
}

export interface IProductOrder {
  product: string
  quantity: number
  date_delivered?: Date
  status?: OrderStatus
}

export interface IOrder {
  customer: string
  customer_first_name: string
  customer_last_name: string
  order_number: string
  amount: number
  status: OrderStatus
  payment_status: PaymentStatus
  total_quantity: number
  date: Date
  products: IProductOrder[]
  address: string
}

export interface IOrderModel extends Document, IOrder {}
