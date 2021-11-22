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
exports.User = exports.validateResetPasswordDetails = exports.validateEmail = exports.validateLogin = exports.validateUser = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("config"));
//import Joi from "joi";
const jwt = __importStar(require("jsonwebtoken"));
// import * as objectId from "joi-objectid";
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
const userSchema = new mongoose_1.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 20
    },
    last_name: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 20
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    sex: {
        type: String,
        //required: true,
        minlength: 4,
        maxlength: 6
    },
    dob: {
        type: String,
        // required: true,
    },
    active: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    profileCompleted: {
        type: Boolean,
        default: false
    },
    referral_code: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, email: this.email }, config_1.default.get('jwtPrivateKey'));
    return token;
};
const validateUser = (user) => {
    //Old implementation
    //const schema = { name: Joi.string().min(3).required};
    // return Joi.validate(genre, schema) --this is the old validation method in node v14
    //new implementation
    const schema = Joi.object({
        first_name: Joi.string().min(3).max(20).required(),
        last_name: Joi.string().min(3).max(20).required(),
        email: Joi.string().min(5).max(255).required().email(),
        referral_code: Joi.string().optional(),
        password: Joi.string().min(5).max(1024).required()
    }); // new validation for schema  in node v16
    return schema.validate(user); // new validation method in node v16
};
exports.validateUser = validateUser;
const validateLogin = (user) => {
    const schema = Joi.object({
        email: Joi.string().min(3).max(20).required().email(),
        password: Joi.string().min(3).max(20).required()
    });
    return schema.validate(user);
};
exports.validateLogin = validateLogin;
const validateEmail = (user) => {
    const schema = Joi.object({
        email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email()
    });
    return schema.validate(user);
};
exports.validateEmail = validateEmail;
const validateResetPasswordDetails = (user) => {
    const schema = Joi.object({
        // email: Joi.string()
        //     .min(3).max(20).required().email(),
        user_id: Joi.objectId().required(),
        token: Joi.string().required(),
        password: Joi.string().min(5).max(1024).required()
    });
    return schema.validate(user);
};
exports.validateResetPasswordDetails = validateResetPasswordDetails;
//create schema object for users
exports.User = (0, mongoose_1.model)('User', userSchema);
// export const validate = validateUser;
//# sourceMappingURL=user.model.js.map