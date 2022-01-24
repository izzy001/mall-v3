import { OAuth2Client } from 'google-auth-library';
import * as otpGenerator from 'otp-generator';
import * as crypto from 'crypto';
import bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { User, validateUser, validateLogin, validateEmail, validateResetPasswordDetails } from '../models/user.model';
import { Token } from '../models/token.model';
import { Otp } from '../models/otp.model';
import { TwoFA } from '../models/2FA.model';

export const sendOtp = async (req: any, res: any) => {
    const otpEmailExists = await Otp.findOne({ email: req.body.email });
    if (otpEmailExists?.verified === true) return res.status(403).send({
        message: "This user is verified!...Kindly proceed to register user"
    });

    if (otpEmailExists?.verified === false) {
        await Otp.deleteOne({ email: req.body.email });
    }

    //attempting to generate otp
    //Generate OTP 
    const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });

    //create OTP instance in DB
    const otp_instance = await Otp.create({
        email: req.body.email,
        otp: otp,
        expiration_time: Date.now() + 300000
    });

    const verification_token = otp_instance.generateOtpToken();
    res.send({
        message: "Otp has been successfully sent to user",
        details: verification_token,
        otp: otp
    });
};

//check if 2FA is set by user
export const check2FAStatus = async (req: any, res: any) => {

    const emailExistsInRecord = await User.findOne({ email: req.body.email });
    if (!emailExistsInRecord) return res.status(400).send('This email does not exist in our records');

    console.log(`This is user record ${emailExistsInRecord}`)

    const status = emailExistsInRecord.two_factor_authentication;
    return res.send({
        "message": "2FA status retrieved successfully",
        "status": status
    });
};


export const send2FACode = async (req: any, res: any) => {

    const twoFAEmailExists = await TwoFA.findOne({ email: req.body.email });

    if (twoFAEmailExists) {
        await TwoFA.deleteOne({ email: req.body.email });
    }

    const emailExistsInRecord = await User.findOne({ email: req.body.email });
    if (!emailExistsInRecord) return res.status(400).send('This email does not exist in our records');

    //attempting to generate otp
    //Generate OTP 
    const otp = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });

    //create OTP instance in DB
    const twoFA_instance = await TwoFA.create({
        email: req.body.email,
        otp: otp,
        expiration_time: Date.now() + 300000
    });

    const verification_token = twoFA_instance.generate2FAToken();
    res.send({
        message: "Otp has been successfully sent to user",
        details: verification_token,
        otp: otp
    });
};

export const verify2FAToken = async (req: any, res: any) => {
    //check if email is valid
    const isEmailValid = await TwoFA.findOne({ email: req.user.email });
    if (!isEmailValid) return res.status(400).send({ message: 'This email is not in our records' });
    const isValidOtp = await TwoFA.findOne({ otp: req.body.otp });
    if (!isValidOtp) return res.status(400).send({ message: 'This token is invalid! Resend OTP' });
    if (new Date() > new Date(req.user.expiration_time)) return res.status(400).send(
        { message: 'This token is expired! Resend OTP' });
    if (req.body.otp == req.user.otp) return res.send({ message: 'Otp verified succesfully!' });
};

export const verifyOtp = async (req: any, res: any) => {
    //check if email is valid
    const isEmailValid = await Otp.findOne({ email: req.user.email });
    if (!isEmailValid) return res.status(400).send('This email is not valid for verification!');
    const isValidOtp = await Otp.findOne({ otp: req.body.otp });
    if (!isValidOtp) return res.status(400).send('This token is invalid! Resend OTP');
    if (new Date() > new Date(req.user.expiration_time)) return res.status(400).send('This token is expired! Resend OTP');
    if (req.body.otp == req.user.otp) { await Otp.updateOne({ verified: true }) };
    res.send({ message: 'Otp verified succesfully!' });
};

export const registerUser = async (req: any, res: any) => {
    // console.log(`This is the new request ${req.body.first_name}`);
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send({
        validation_details: error.details[0].message
    });

    //Check if user is verified
    let userIsVerified = await Otp.findOne({ email: req.body.email }, { verified: true });
    if (!userIsVerified) return res.status(400).send({
        details: 'This user have not verified their email!'
    });

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({
        details: 'This user already exists!'
    })

    user = new User(_.pick(req.body, ['first_name', 'last_name', 'email', 'password', 'referral_code']));



    //TODO: send activation code to user for confirmation. Set up mailing service.
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).status(201).send(_.pick(user, ['_id', 'first_name', 'email']));
};

export const getUser = async (req: any, res: any) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
};


export const loginUser = async (req: any, res: any) => {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send({
        validation_details: error.details[0].message
    });
    //UserExistCheck
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Account does not exist with provided email and password combination.');

    //Compare Passwords
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Incorrect Password');

    const token = user.generateAuthToken();
    //res.header('x-auth-token', token).send(_.pick(user, ['_id', 'first_name', 'email']));
    res.send({
        message: "User Login Successful",
        details: _.pick(user, ['_id', 'first_name', 'email']),
        token: token
    });
};

export const requestPasswordReset = async (req: any, res: any) => {
    const { error } = validateEmail(req.body);
    if (error) return res.status(400).send({
        validation_details: error.details[0].message
    });

    //EmailExistCheck
    const email = req.body.email;
    const user = await User.findOne({ email });
    if (!user) return res.status(400)
        .send('Sorry! We do not have this email in our records. Please try again with email registered on altmall');

    //Check for existing Token
    let token = await Token.findOne({ user_id: user._id });
    if (token) await token.deleteOne();


    let resetToken = crypto.randomBytes(10).toString('hex'); //Math.random().toString(36).substr(2, 5); //crypto.randomBytes(32).toString('hex');
    console.log(`This is the reset token generated ${resetToken}`);
    const saltRounds = 10;
    //const salt = await bcrypt.genSalt(saltRounds);
    await bcrypt.hash(resetToken, saltRounds, async function (err, hash) {
        await new Token({
            user_id: user._id,
            token: hash,
            createdAt: Date.now()
        }).save();
        console.log(`This is the hashed reset token : ${hash}`);
        const link = `http://localhost:8000/passwordReset?token=${resetToken}&id=${user._id}`;
        return res.send(link);
    });




    // const link = `${clientURL}/passwordReset?token=${resetToken}&id=${user._id}`;

    //TODO : email sending via Template to customers: waiting for templates from Cx
}

export const resetPassword = async (req: any, res: any) => {
    const { error } = validateResetPasswordDetails(req.body);
    if (error) return res.status(400).send({
        validation_details: error.details[0].message
    });

    //Check if token exist
    const passwordResetToken = await Token.findOne({ user_id: req.body.user_id });
    if (!passwordResetToken) return res.status(400).send({
        details: "Invalid or expired password reset token"
    });


    //check if reset token received matches with token saved to user's profile
    const isValid = await bcrypt.compare(req.body.token, passwordResetToken.token);
    if (!isValid) return res.status(400).send({
        details: "Invalid or expired password reset token"
    });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    await User.updateOne({ _id: req.body.user_id },
        { $set: { password: hash } },
        { new: true });

    const user = await User.findById({ _id: req.body.user_id });

    //TODO: email sending via Template to customers: waiting on Cx

    //await passwordResetToken.deleteOne();
    return res.send({
        message: 'Password change is successful'
    });

}