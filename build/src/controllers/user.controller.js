"use strict";
//update user data 
//user should include: DOB, phone number
//execute using patch method to update user collection 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserProfile = void 0;
const user_model_1 = require("../models/user.model");
//update user profile
const updateUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //authenticate user data via AuthMiddleware
    //check if user exists
    const user = yield user_model_1.User.findOne({ email: req.user.email });
    if (!user)
        return res.status(400).send('Oops! The email provided is not valid');
    //check if password provided to initiate update is correct
    // const validPassword = await bcrypt.compare(req.body.password, user.password);
    // if (!validPassword) return res.status(400).send('Incorrect Password');
    const updatedUser = yield user_model_1.User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true });
    console.log(`This is updated user ${updatedUser}`);
    if (updatedUser.sex != "" || null && updatedUser.dob != "" || null) {
        const userProfileComplete = yield user_model_1.User.findByIdAndUpdate(req.user._id, { profileCompleted: true });
        return res.send(userProfileComplete);
    }
    ;
    res.send(updatedUser);
});
exports.updateUserProfile = updateUserProfile;
//# sourceMappingURL=user.controller.js.map