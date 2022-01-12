import express from 'express';
import * as auth from '../controllers/auth.controller';
import { AuthMiddleware } from '../middleware/auth'
import { TokenMiddleware } from '../middleware/token'

export const authRouter = express.Router();

//send token
authRouter.post('/send-verification-code', auth.sendOtp);
authRouter.post('/check-2fa-status', auth.check2FAStatus);
authRouter.post('/send-2fa-code', auth.send2FACode);
authRouter.post('/verify-2fa-code', TokenMiddleware, auth.verify2FAToken);
//authRouter.post('/verify-token', TokenMiddleware, auth.verifyToken);
authRouter.post('/verify-otp',TokenMiddleware, auth.verifyOtp);

authRouter.post('/register', auth.registerUser);
authRouter.get('/me', AuthMiddleware, auth.getUser);
authRouter.post('/login', auth.loginUser);
authRouter.post('/initiate-password-reset', auth.requestPasswordReset);
authRouter.post('/password-reset', auth.resetPassword);




