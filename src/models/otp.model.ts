import { Schema, Document, model, ObjectId } from "mongoose";
import * as jwt from "jsonwebtoken";
import config from "config";

export interface IOtp {
    email: string
    otp: string
    expiration_time: Date
    verified: boolean
}

const otpSchema = new Schema({
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
    verified: { type: Boolean, default: false}
},
{
    timestamps: true
});

export default interface IOtpModel extends Document, IOtp {
    generateOtpToken(): string
}

otpSchema.methods.generateOtpToken = function() {
    const token = jwt.sign({ email: this.email, otp: this.otp, expiration_time: this.expiration_time}, config.get('jwtPrivateKey'));
    return token;
}

export const Otp = model<IOtpModel>('Otp', otpSchema);


