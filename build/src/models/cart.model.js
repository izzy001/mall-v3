"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const mongoose_1 = require("mongoose");
const cartSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    items: [
        {
            product_id: { type: mongoose_1.Schema.Types.ObjectId, ref: "Product" },
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
}, {
    timestamps: true
});
//create schema object for carts
exports.Cart = (0, mongoose_1.model)('Cart', cartSchema);
//# sourceMappingURL=cart.model.js.map