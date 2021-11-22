"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserCart = exports.removeItemFromCart = exports.addToCart = exports.getUserCart = void 0;
const cart_model_1 = require("../models/cart.model");
const user_model_1 = require("../models/user.model");
//get user cart
const getUserCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cart = yield cart_model_1.Cart.findOne({ user_id: req.user._id, checkoutStatus: false });
    //.populate(["user_id"]); //, "items.product"
    if (!cart)
        return res.status(404).send({ message: 'There is no cart instance for user' });
    if (cart.items.length === 0)
        return res.send({ message: 'user cart is empty!' });
    res.send({
        message: 'user cart successfully retrieved',
        details: cart
    });
});
exports.getUserCart = getUserCart;
//add item to Cart
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(req.user._id);
    if (!user)
        return res.status(400).send({
            message: 'Bad Request: Cannot add item to cart',
            details: "This user does not exist"
        });
    //check if req.body.item  passed exists
    // const item = await Product.findById(req.body.item);
    // if(!item) return res.status(400).send({
    //     message: 'Fatal Error: Cannot add item to wish list',
    //     details: "This item does not exist"
    // });
    //check if cart exist for user
    const cartExist = yield cart_model_1.Cart.findOne({ "user_id": req.user._id, checkoutStatus: false });
    if (cartExist) {
        //update cart instance for user by pushing new Product
        return res.send({
            message: "cart updated!",
            // details: updatedWishlist
        });
    }
    ;
    if (!cartExist) {
        let newCartInstance = new cart_model_1.Cart({
            user_id: req.user._id,
            items: {
                product_id: req.body.product_id,
                quantity: req.body.quantity,
                color: req.body.color,
                size: req.body.size,
                price: req.body.price //should be quantity * item price
            }
        });
        yield newCartInstance.save();
        return res.send({
            message: "item added to cart successfully",
            details: newCartInstance
        });
    }
});
exports.addToCart = addToCart;
//remove item from cart
const removeItemFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(req.user._id);
    console.log(`This is user_id: ${req.user._id}`);
    if (!user)
        return res.status(404).send({
            message: 'Bad Request: Cannot remove the item from cart',
            details: "This user does not exist"
        });
    //check if cart exist for user
    const cartExist = yield cart_model_1.Cart.findOne({ user_id: req.user._id });
    if (!cartExist)
        return res.status(404).send({
            message: 'Bad Request',
            details: "Cannot find cart for this user"
        });
    const removeCartItem = yield cart_model_1.Cart.findOneAndRemove({ 'items._id': req.params.id });
    if (!removeCartItem)
        return res.status(404).send({
            message: 'Bad Request: Cannot remove the item from cart',
            details: "This item does not exist in user's cart"
        });
    res.send({
        message: 'This item has been removed from the cart successfully!',
        details: removeCartItem
    });
});
exports.removeItemFromCart = removeItemFromCart;
//delete user Cart
const deleteUserCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(req.user._id);
    console.log(`This is user_id: ${req.user._id}`);
    if (!user)
        return res.status(404).send({
            message: 'Bad Request: Cannot remove the item from cart',
            details: "This user does not exist"
        });
    //check if cart exist for user
    const cartExist = yield cart_model_1.Cart.findOne({ user_id: req.user._id });
    if (!cartExist)
        return res.status(404).send({
            message: 'Bad Request',
            details: "Cannot find cart for this user"
        });
    const emptyCart = yield cart_model_1.Cart.findByIdAndDelete(req.params.id);
    if (!emptyCart)
        return res.status(404).send({
            message: 'Bad Request: cart instance not found',
            details: "no cart instance for this user"
        });
    res.send({
        message: 'Cart instance deleted successfully',
        details: emptyCart
    });
});
exports.deleteUserCart = deleteUserCart;
//# sourceMappingURL=cart.controller.js.map