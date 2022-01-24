import express from 'express';
import * as wishlist from '../controllers/wishlist.controller';
import { AuthMiddleware } from '../middleware/auth'

export const wishlistRouter = express.Router()

wishlistRouter.post('/', AuthMiddleware, wishlist.addToWishlist);
wishlistRouter.get('/', AuthMiddleware, wishlist.getUserWishlist);
wishlistRouter.delete('/item/:id',AuthMiddleware, wishlist.removeItemFromWishlist);
wishlistRouter.delete('/:id', AuthMiddleware, wishlist.deleteWishlist);
//userRouter.put('/password-reset', cart.updateCart);




