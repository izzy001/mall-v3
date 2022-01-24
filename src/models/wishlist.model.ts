import { Schema, Document, model, ObjectId, Number } from "mongoose";
import config from "config";
import Joi from "joi";
import * as jwt from "jsonwebtoken";

export interface IWishlist {
    user: ObjectId,
    items: Array<Object>,
}

export default interface IWishlistModel extends Document, IWishlist {

}

const wishlistSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    items: [
        {
            _id: false,
            product: { type: Schema.Types.ObjectId, ref: "Product" }
        }
    ],
    __v: {
        type: Number,
        select: false
    },
},
    {
        timestamps: true
    });


    //create schema object for carts
    export const Wishlist =  model('Wishlist', wishlistSchema);