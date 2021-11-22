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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.loginUser = exports.getUser = exports.registerUser = exports.verifyOtp = exports.sendOtp = void 0;
const otpGenerator = __importStar(require("otp-generator"));
const crypto = __importStar(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const _ = __importStar(require("lodash"));
const user_model_1 = require("../models/user.model");
const token_model_1 = require("../models/token.model");
const otp_model_1 = require("../models/otp.model");
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //attempting to generate otp
    //Generate OTP 
    const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
    //create OTP instance in DB
    const otp_instance = yield otp_model_1.Otp.create({
        email: req.body.email,
        otp: otp,
        expiration_time: Date.now() + 300000
    });
    const verification_token = otp_instance.generateOtpToken();
    res.send({
        message: "Otp has been successfully sent to user",
        details: verification_token
    });
});
exports.sendOtp = sendOtp;
const verifyOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if email is valid
    const isEmailValid = yield otp_model_1.Otp.findOne({ email: req.user.email });
    if (!isEmailValid)
        return res.status(400).send('This email is not valid for verification!');
    const isValidOtp = yield otp_model_1.Otp.findOne({ otp: req.body.otp });
    if (!isValidOtp)
        return res.status(400).send('This token is invalid! Resend OTP');
    if (new Date() > new Date(req.user.expiration_time))
        return res.status(400).send('This token is expired! Resend OTP');
    if (req.body.otp == req.user.otp) {
        yield otp_model_1.Otp.updateOne({ verified: true });
    }
    ;
    res.send({ message: 'Otp verified succesfully!' });
});
exports.verifyOtp = verifyOtp;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(`This is the new request ${req.body.first_name}`);
    const { error } = (0, user_model_1.validateUser)(req.body);
    if (error)
        return res.status(400).send({
            validation_details: error.details[0].message
        });
    //Check if user is verified
    let userIsVerified = yield otp_model_1.Otp.findOne({ email: req.body.email }, { verified: true });
    if (!userIsVerified)
        return res.status(400).send({
            details: 'This user does not exist!'
        });
    let user = yield user_model_1.User.findOne({ email: req.body.email });
    if (user)
        return res.status(400).send({
            details: 'This user already exists!'
        });
    user = new user_model_1.User(_.pick(req.body, ['first_name', 'last_name', 'email', 'password', 'referral_code']));
    //TODO: send activation code to user for confirmation. Set up mailing service.
    const salt = yield bcrypt_1.default.genSalt(10);
    user.password = yield bcrypt_1.default.hash(user.password, salt);
    yield user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'first_name', 'email']));
});
exports.registerUser = registerUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(req.user._id).select('-password');
    res.send(user);
});
exports.getUser = getUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, user_model_1.validateLogin)(req.body);
    if (error)
        return res.status(400).send({
            validation_details: error.details[0].message
        });
    //UserExistCheck
    const user = yield user_model_1.User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send('Account does not exist with provided email and password combination.');
    //Compare Passwords
    const validPassword = yield bcrypt_1.default.compare(req.body.password, user.password);
    if (!validPassword)
        return res.status(400).send('Incorrect Password');
    const token = user.generateAuthToken();
    //res.header('x-auth-token', token).send(_.pick(user, ['_id', 'first_name', 'email']));
    res.header('x-auth-token', token).send({
        message: "User Login Successful",
        details: _.pick(user, ['_id', 'first_name', 'email'])
    });
});
exports.loginUser = loginUser;
const requestPasswordReset = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, user_model_1.validateEmail)(req.body);
    if (error)
        return res.status(400).send({
            validation_details: error.details[0].message
        });
    //EmailExistCheck
    const email = req.body.email;
    const user = yield user_model_1.User.findOne({ email });
    if (!user)
        return res.status(400)
            .send('Sorry! We do not have this email in our records. Please try again with email registered on altmall');
    //Check for existing Token
    let token = yield token_model_1.Token.findOne({ user_id: user._id });
    if (token)
        yield token.deleteOne();
    let resetToken = crypto.randomBytes(10).toString('hex'); //Math.random().toString(36).substr(2, 5); //crypto.randomBytes(32).toString('hex');
    console.log(`This is the reset token generated ${resetToken}`);
    const salt = yield bcrypt_1.default.genSalt(10);
    const hash = yield bcrypt_1.default.hash(resetToken, salt);
    console.log(`This is the hashed reset token : ${hash}`);
    yield new token_model_1.Token({
        user_id: user._id,
        token: hash,
        createdAt: Date.now()
    }).save();
    // const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;
    const link = `http://localhost:8000/passwordReset?token=${hash}&id=${user._id}`;
    //TODO : email sending via Template to customers: waiting for templates from Cx
    res.send(link);
});
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { error } = (0, user_model_1.validateResetPasswordDetails)(req.body);
    if (error)
        return res.status(400).send({
            validation_details: error.details[0].message
        });
    //Check if token exist
    const passwordResetToken = yield token_model_1.Token.findOne({ user_id: req.body.user_id });
    console.log(`This is a password reset token ${passwordResetToken}`);
    if (!passwordResetToken)
        return res.status(400).send({
            details: "Invalid or expired password reset token"
        });
    //check if reset token received matches with token saved to user's profile
    console.log(`this is the token from request ${req.body.token}`);
    const isValid = yield bcrypt_1.default.compare(req.body.token, passwordResetToken.token);
    console.log(isValid);
    if (!isValid)
        return res.status(400).send({
            details: "Invalid or expired password reset token"
        });
    const salt = yield bcrypt_1.default.genSalt(10);
    const hash = yield bcrypt_1.default.hash(req.body.password, salt);
    yield user_model_1.User.updateOne({ _id: req.body.user_id }, { $set: { password: hash } }, { new: true });
    const user = yield user_model_1.User.findById({ _id: req.body.user_id });
    //TODO: email sending via Template to customers: waiting on Cx
    yield passwordResetToken.deleteOne();
    return true;
});
exports.resetPassword = resetPassword;
//# sourceMappingURL=auth.controller.js.map