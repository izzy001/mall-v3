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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth = __importStar(require("../controllers/auth.controller"));
const auth_1 = require("../middleware/auth");
const token_1 = require("../middleware/token");
exports.authRouter = express_1.default.Router();
//send token
exports.authRouter.post('/send-verification-code', auth.sendOtp);
exports.authRouter.post('/check-2fa-status', auth.check2FAStatus);
exports.authRouter.post('/send-2fa-code', auth.send2FACode);
exports.authRouter.post('/verify-2fa-code', token_1.TokenMiddleware, auth.verify2FAToken);
//authRouter.post('/verify-token', TokenMiddleware, auth.verifyToken);
exports.authRouter.post('/verify-otp', token_1.TokenMiddleware, auth.verifyOtp);
exports.authRouter.post('/register', auth.registerUser);
exports.authRouter.get('/me', auth_1.AuthMiddleware, auth.getUser);
exports.authRouter.post('/login', auth.loginUser);
exports.authRouter.post('/initiate-password-reset', auth.requestPasswordReset);
exports.authRouter.post('/password-reset', auth.resetPassword);
//# sourceMappingURL=auth.route.js.map