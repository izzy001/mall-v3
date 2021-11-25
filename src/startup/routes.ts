import express from 'express';
import error from '../middleware/error';
import {authRouter}  from '../routes/auth.route';
import {cartRouter} from '../routes/cart.route';
import {wishlistRouter} from '../routes/wishlist.route'
import {userRouter} from '../routes/user.route'

export function route(app: any){
     app.use(express.json());
     app.use('/api/auth/', authRouter);
     app.use('/api/cart/', cartRouter);
     app.use('/api/wishlist', wishlistRouter)
     app.use('/api/user', userRouter);
     app.use(error);
}