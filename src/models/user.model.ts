import { Schema, Document, model } from "mongoose";
import config from "config";
//import Joi from "joi";
import * as jwt from "jsonwebtoken";
import { joiObjectId } from "../startup/validation";
// import * as objectId from "joi-objectid";
const Joi = require("joi");
Joi.objectId = require('joi-objectid')(Joi);
export interface IUser {
    first_name: string
    last_name: string
    email: string
    sex: string
    dob: string
    phone: string
    password: string
    referral_code: string
    active: boolean
    two_factor_authentication: boolean
}

export default interface IUserModel extends Document, IUser {
    generateAuthToken(): string
    validateUser(user: IUser): object
    validateLogin(user: IUser): object
    validateEmail(user: IUser): object
    validateResetPasswordDetails(user: any): object
}

const userSchema = new Schema({
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
    phone: {
        type: String,
        trim: true,
        minlength: 11,
        maxlength: 14
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
    profile_completed: {
        type: Boolean,
        default: false
    },
    two_factor_authentication: { 
        type: Boolean,
        default: false
    },
    referral_code: {
        type: String,
        trim: true
    }

},
    {
        timestamps: true
    });

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, email: this.email }, config.get('jwtPrivateKey'));
    return token;
}

export const validateUser = (user: object) => {
    //Old implementation
    //const schema = { name: Joi.string().min(3).required};
    // return Joi.validate(genre, schema) --this is the old validation method in node v14

    //new implementation
    const schema = Joi.object({
        first_name: Joi.string().min(3).max(20).required(),
        last_name: Joi.string().min(3).max(20).required(),
        email: Joi.string().min(5).max(255).required().email(),
        referral_code: Joi.string().optional(),
        password: Joi.string().min(5).max(1024).pattern(new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d]).{8,35}$/)).required()
    }); // new validation for schema  in node v16


    return schema.validate(user); // new validation method in node v16
};

export const validateLogin = (user: object) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).pattern(new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d]).{8,35}$/)).required()
    });

    return schema.validate(user);
};

export const validateEmail = (user: object) => {
    const schema = Joi.object({
        email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email()
    });
    return schema.validate(user);
}

export const validateResetPasswordDetails = (user: object) => {
    const schema = Joi.object({
        // email: Joi.string()
        //     .min(3).max(20).required().email(),
        user_id: Joi.objectId().required(),
        token: Joi.string().required(),
        password: Joi.string().min(5).max(1024).pattern(new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d]).{8,35}$/)).required()
    });
    return schema.validate(user);
}

export const validateUserUpdate = (user: object) => {
    const schema = Joi.object({ 
        sex: Joi.string().valid('male', 'female').optional(),
        dob: Joi.date().iso().optional(),
        phone: Joi.string().min(11).max(14).optional(),
        two_factor_authentication: Joi.boolean().optional(),
    });
    return schema.validate(user);
}

//create schema object for users
export const User = model<IUserModel>('User', userSchema);

// export const validate = validateUser;

