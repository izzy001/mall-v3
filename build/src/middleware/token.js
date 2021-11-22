"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const TokenMiddleware = function (req, res, next) {
    const token = req.body.token;
    // console.log(token);
    if (!token)
        return res.status(401).send('No token is provided!');
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.get('jwtPrivateKey'));
        req.user = decoded;
        console.log(`This is the user  verify decoded token ${req.user}`);
        next();
    }
    catch (error) {
        return res.status(400).send('This user token is not valid!');
    }
};
exports.TokenMiddleware = TokenMiddleware;
//# sourceMappingURL=token.js.map