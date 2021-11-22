"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const AuthMiddleware = function (req, res, next) {
    const token = req.header('x-auth-token');
    // console.log(token);
    if (!token)
        return res.status(401).send('This user is not authenticated');
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.get('jwtPrivateKey'));
        req.user = decoded;
        // console.log(`This is the user decoded token ${req.user}`)
        next();
    }
    catch (error) {
        return res.status(400).send('This user token is not valid!');
    }
};
exports.AuthMiddleware = AuthMiddleware;
//# sourceMappingURL=auth.js.map