"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
const express_1 = __importDefault(require("express"));
const error_1 = __importDefault(require("../middleware/error"));
const auth_route_1 = require("../routes/auth.route");
const cart_route_1 = require("../routes/cart.route");
const wishlist_route_1 = require("../routes/wishlist.route");
const user_route_1 = require("../routes/user.route");
function route(app) {
    app.use(express_1.default.json());
    app.use('/api/auth/', auth_route_1.authRouter);
    app.use('/api/cart/', cart_route_1.cartRouter);
    app.use('/api/wishlist', wishlist_route_1.wishlistRouter);
    app.use('/api/user', user_route_1.userRouter);
    app.use(error_1.default);
}
exports.route = route;
//# sourceMappingURL=routes.js.map