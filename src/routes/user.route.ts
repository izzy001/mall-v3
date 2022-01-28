import express from 'express';
import * as user from '../controllers/user.controller';
import { AuthMiddleware } from '../middleware/auth'


export const userRouter = express.Router()

//send token
userRouter.patch('/update/me', AuthMiddleware, user.updateUserProfile);
userRouter.post('/confirm/me', AuthMiddleware, user.confirmUserPassword);
userRouter.patch('/update-password/me', AuthMiddleware, user.changePassword);
userRouter.post('/address/me', AuthMiddleware, user.addAddress)
userRouter.patch('/address/:id', AuthMiddleware, user.updateAddress)
userRouter.delete('/address/:id', AuthMiddleware, user.deleteAddress )

