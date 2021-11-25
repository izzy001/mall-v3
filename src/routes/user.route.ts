import express from 'express';
import * as user from '../controllers/user.controller';
import { AuthMiddleware } from '../middleware/auth'


export const userRouter = express.Router()

//send token
userRouter.patch('/update/me', AuthMiddleware, user.updateUserProfile);



