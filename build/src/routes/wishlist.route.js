"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishlistRouter = void 0;
const express_1 = __importDefault(require("express"));
const wishlist = __importStar(require("../controllers/wishlist.controller"));
const auth_1 = require("../middleware/auth");
exports.wishlistRouter = express_1.default.Router();
exports.wishlistRouter.post('/', auth_1.AuthMiddleware, wishlist.addToWishlist);
exports.wishlistRouter.get('/', auth_1.AuthMiddleware, wishlist.getUserWishlist);
exports.wishlistRouter.delete('/item/:id', auth_1.AuthMiddleware, wishlist.removeItemFromWishlist);
// wishlistRouter.delete('/', cart.deleteUserCart);
//userRouter.put('/password-reset', cart.updateCart);
//# sourceMappingURL=wishlist.route.js.map