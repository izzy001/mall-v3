import { Schema, Document, model, ObjectId } from "mongoose";
import * as jwt from "jsonwebtoken";
import config from "config";

export interface I2FA {
    email: string
    otp: string
    expiration_time: Date
}

const twoFASchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    otp:{ type: String , required: true},
    expiration_time:{ 
        type: Date},
},
{
    timestamps: true
});

export default interface I2FAModel extends Document, I2FA {
    generate2FAToken(): string
}

twoFASchema.methods.generate2FAToken = function() {
    const token = jwt.sign({ email: this.email, otp: this.otp, expiration_time: this.expiration_time}, config.get('jwtPrivateKey'));
    return token;
}

export const TwoFA = model<I2FAModel>('TwoFA', twoFASchema);


