import express from 'express';
import * as auth from '../controllers/auth.controller';
import { AuthMiddleware } from '../middleware/auth'
import { TokenMiddleware } from '../middleware/token'

export const userRouter = express.Router()

//send token
userRouter.post('/send-verification-code', auth.sendOtp);
//userRouter.post('/verify-token', TokenMiddleware, auth.verifyToken);
userRouter.post('/verify-otp',TokenMiddleware, auth.verifyOtp);

userRouter.post('/register', auth.registerUser);
userRouter.get('/me', AuthMiddleware, auth.getUser);
userRouter.post('/login', auth.loginUser);
userRouter.post('/initiate-password-reset', auth.requestPasswordReset);
userRouter.post('/password-reset', auth.resetPassword);




