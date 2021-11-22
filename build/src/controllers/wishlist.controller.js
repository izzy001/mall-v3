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
exports.deleteWishlist = exports.removeItemFromWishlist = exports.addToWishlist = exports.getUserWishlist = void 0;
const wishlist_model_1 = require("../models/wishlist.model");
const user_model_1 = require("../models/user.model");
//get user wishlist
const getUserWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wishlist = yield wishlist_model_1.Wishlist.findOne({ user_id: req.user._id });
    if (!wishlist)
        return res.status(404).send({
            message: 'Wishlist not found for this user'
        });
    res.send({
        message: 'user wishlist successfully retrieved',
        details: wishlist
    });
});
exports.getUserWishlist = getUserWishlist;
//add item to wish list
const addToWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if request header token is valid: using the auth middle ware in the wishlist routes
    //check if user exist
    const user = yield user_model_1.User.findById(req.user._id);
    if (!user)
        return res.status(400).send({
            message: 'Bad Request: Cannot add item to wish list',
            details: "This user does not exist"
        });
    //check if req.body.item  passed exists
    // const item = await Product.findById(req.body.item);
    // if(!item) return res.status(400).send({
    //     message: 'Fatal Error: Cannot add item to wish list',
    //     details: "This item does not exist"
    // });
    //check if wishlist exist for user
    const wishlist = yield wishlist_model_1.Wishlist.findOne({ "user_id": req.user._id });
    if (wishlist) {
        console.log(req.body.product_id);
        console.log(`this is wishlist id: ${wishlist._id}`);
        const updatedWishlist = yield wishlist_model_1.Wishlist.findByIdAndUpdate({ _id: wishlist._id }, { $addToSet: { items: req.body.product_id } }, { returnDocument: 'after' });
        return res.send({
            message: "wishlist updated!",
            details: updatedWishlist
        });
    }
    ;
    if (!wishlist) {
        let newWishlist = new wishlist_model_1.Wishlist({
            user_id: req.user._id,
            items: {
                product_id: req.body.product_id
            }
        });
        yield newWishlist.save();
        return res.send({
            message: "Item added to wishlist!",
            details: newWishlist
        });
    }
});
exports.addToWishlist = addToWishlist;
//remove item from wish list
const removeItemFromWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if request header token is valid: using the auth middle ware in the wishlist routes
    //check if user exist
    const user = yield user_model_1.User.findById(req.user._id);
    console.log(`This is user_id: ${req.user._id}`);
    if (!user)
        return res.status(400).send({
            message: 'Bad Request: Cannot remove the item from wish list',
            details: "This user does not exist"
        });
    //check if wishlist exist for user
    const wishlistExist = yield wishlist_model_1.Wishlist.findOne({ user_id: req.user._id });
    if (!wishlistExist)
        return res.status(404).send({
            message: 'Bad Request',
            details: "Cannot find wishlist for this user"
        });
    const removeWishlistItem = yield wishlist_model_1.Wishlist.findOneAndRemove({ 'items._id': req.params.id });
    if (!removeWishlistItem)
        return res.status(404).send({
            message: 'Bad Request: Cannot remove the item from wish list',
            details: "This item does not exist in user's wishlist"
        });
    res.send({
        message: 'This item has been removed from the wishlist successfully!',
        details: removeWishlistItem
    });
});
exports.removeItemFromWishlist = removeItemFromWishlist;
//delete wishlist
const deleteWishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
});
exports.deleteWishlist = deleteWishlist;
//# sourceMappingURL=wishlist.controller.js.map