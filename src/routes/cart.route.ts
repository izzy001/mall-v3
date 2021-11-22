import express from 'express';
import * as cart from '../controllers/cart.controller';
import { AuthMiddleware } from '../middleware/auth'

export const cartRouter = express.Router()

cartRouter.post('/',AuthMiddleware, cart.addToCart);
cartRouter.get('/',AuthMiddleware, cart.getUserCart);
cartRouter.delete('/:id',AuthMiddleware, cart.deleteUserCart);
cartRouter.delete('/item/:id', AuthMiddleware, cart.removeItemFromCart);




