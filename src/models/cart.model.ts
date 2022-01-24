import { Schema, Document, model, ObjectId, Number } from "mongoose";
import config from "config";
import Joi from "joi";
import * as jwt from "jsonwebtoken";

export interface ICart {
    user: ObjectId,
    items: Array<Object>,
    checkoutStatus: boolean
}

export default interface ICartModel extends Document, ICart {

}

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number },
            size: { type: String },
            color: { type: String },
            price: { type: String },
        }
    ],
    checkoutStatus: {
        type: Boolean,
        default: false,
    },
    __v: {
        type: Number,
        select: false
    },
},
    {
        timestamps: true
    });


    //create schema object for carts
    export const Cart = model<ICartModel>('Cart', cartSchema);