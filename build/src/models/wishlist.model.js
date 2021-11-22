"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wishlist = void 0;
const mongoose_1 = require("mongoose");
const wishlistSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    items: [
        {
            _id: false,
            product_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product" }
        }
    ],
    __v: {
        type: Number,
        select: false
    },
}, {
    timestamps: true
});
//create schema object for carts
exports.Wishlist = (0, mongoose_1.model)('Wishlist', wishlistSchema);
//# sourceMappingURL=wishlist.model.js.map