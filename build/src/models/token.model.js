"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
    user_id: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.Token = (0, mongoose_1.model)('Token', tokenSchema);
//# sourceMappingURL=token.model.js.map