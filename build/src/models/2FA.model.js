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
exports.TwoFA = void 0;
const mongoose_1 = require("mongoose");
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
const twoFASchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    otp: { type: String, required: true },
    expiration_time: {
        type: Date
    },
}, {
    timestamps: true
});
twoFASchema.methods.generate2FAToken = function () {
    const token = jwt.sign({ email: this.email, otp: this.otp, expiration_time: this.expiration_time }, config_1.default.get('jwtPrivateKey'));
    return token;
};
exports.TwoFA = (0, mongoose_1.model)('TwoFA', twoFASchema);
//# sourceMappingURL=2FA.model.js.map