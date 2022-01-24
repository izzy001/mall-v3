import { Document } from 'mongoose'

export enum ProductStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ProductCampaignRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export interface IProductSize {
  size: string
  price: number
  quantity: number
  sale: {
    price: number
    start_date: Date
    end_date: Date
  }
}

export interface IProduct {
  vendor: string
  name: string
  brand: string
  category?: string
  subCategory?: string
  childSubCategory?: string
  grandChildSubCategory?: string
  color: string[]
  long_description: string
  short_description: string
  weight: number
  dimensions: string
  warranty: string
  specification: string
  price: number
  sale: {
    price: number
    start_date: Date
    end_date: Date
  }
  discount_price: number
  discount_percentage: number
  size_variations?: IProductSize[]
  quantity: number
  primary_image: string
  sku: string
  images: string[]
  fairmall_region: string
  status?: ProductStatus
  enabled: boolean
  is_top_deal: boolean
  is_bento: boolean
  is_procurement: boolean
  is_bundle: boolean
  is_deleted: boolean
  campaign?: {
    id: string
    name?: string
    status?: string
    comment?: string
  }
  admin_note?: string
}

export interface IProductModel extends Document, IProduct {}