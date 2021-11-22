import Joi from "joi";
import { Schema, model, ObjectId } from "mongoose";

export interface IToken {
    user_id: ObjectId
    token: string
    createdAt: Date
}
const tokenSchema = new Schema({
    user_id: { 
        type: Schema.Types.ObjectId,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // this is the expiry time in seconds
    }
});

// export const validateOtpDetails = ( user: object) => {
//     const schema = Joi.object({
//         user_id: Joi.objectId()
//     })
// }

export const Token = model<IToken>('Token', tokenSchema);