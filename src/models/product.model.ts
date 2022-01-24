import { model, Schema } from 'mongoose'
import { IProductModel, ProductCampaignRequestStatus, ProductStatus } from '@/types/product'

const productSchema = new Schema(
  {
    vendor: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Vendor',
    },
    name: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: false,
    },
    brand: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Brand',
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    subCategory: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
    },
    childSubCategory: {
      type: Schema.Types.ObjectId,
      ref: 'ChildSubCategory',
    },
    grandChildSubCategory: {
      type: Schema.Types.ObjectId,
      ref: 'GrandChildSubCategory',
    },
    color: { type: [String], default: [] },
    long_description: { type: String, required: true },
    short_description: { type: String, required: true },
    weight: { type: Number, required: true },
    dimensions: { type: String, default: null },
    warranty: { type: String, required: true },
    specification: { type: String, required: true },
    price: { type: Number, required: true },
    sale: {
      price: { type: Number, default: null },
      start_date: { type: Date, default: null },
      end_date: { type: Date, default: null },
    },
    discount_price: {
      type: Number,
      required: false,
    },
    discount_percentage: {
      type: Number,
      required: false,
    },
    size_variations: {
      type: [
        {
          size: String,
          price: Number,
          quantity: Number,
          sale: {
            price: Number,
            start: Date,
            end: Date,
          },
        },
      ],
      default: [],
    },
    quantity: { type: Number, required: true },
    primary_image: { type: String, required: true },
    images: { type: [String], required: true },
    fairmall_region: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(ProductStatus),
      required: true,
      default: ProductStatus.PENDING,
    },
    enabled: { type: Boolean, default: false },
    is_top_deal: { type: Boolean, default: false },
    is_bento: { type: Boolean, default: false },
    is_procurement: { type: Boolean, default: false },
    is_bundle: { type: Boolean, default: false },
    is_deleted: { type: Boolean, default: false },
    campaign: {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Campaign',
      },
      name: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        enum: Object.values(ProductCampaignRequestStatus),
        default: ProductCampaignRequestStatus.PENDING,
      },
      comment: {
        type: String,
        required: false,
      },
    },
    admin_note: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
)

export const Product = model<IProductModel>('Product', productSchema)
