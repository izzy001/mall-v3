import express from 'express';
import error from '../middleware/error';
import {userRouter}  from '../routes/auth.route';
import {cartRouter} from '../routes/cart.route';
import {wishlistRouter} from '../routes/wishlist.route'

export function route(app: any){
     app.use(express.json());
     app.use('/api/auth/', userRouter);
     app.use('/api/cart/', cartRouter);
     app.use('/api/wishlist', wishlistRouter)
     app.use(error);
}