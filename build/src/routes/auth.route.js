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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth = __importStar(require("../controllers/auth.controller"));
const auth_1 = require("../middleware/auth");
const token_1 = require("../middleware/token");
exports.userRouter = express_1.default.Router();
//send token
exports.userRouter.post('/send-verification-code', auth.sendOtp);
//userRouter.post('/verify-token', TokenMiddleware, auth.verifyToken);
exports.userRouter.post('/verify-otp', token_1.TokenMiddleware, auth.verifyOtp);
exports.userRouter.post('/register', auth.registerUser);
exports.userRouter.get('/me', auth_1.AuthMiddleware, auth.getUser);
exports.userRouter.post('/login', auth.loginUser);
exports.userRouter.post('/initiate-password-reset', auth.requestPasswordReset);
exports.userRouter.post('/password-reset', auth.resetPassword);
//# sourceMappingURL=auth.route.js.map