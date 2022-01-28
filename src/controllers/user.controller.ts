//update user data 
//user should include: DOB, phone number
//execute using patch method to update user collection 

import { User, validateUserUpdate, validatePassword } from '../models/user.model';
import bcrypt from 'bcrypt';

//update user profile
export const updateUserProfile = async (req: any, res: any) => {
    //authenticate user data via AuthMiddleware
    //validate data 
    const { error } = validateUserUpdate(req.body);
    if (error) return res.status(400).send({
        validation_details: error.details[0].message
    });
    //check if user exists
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(400).send({
        message: 'Bad Request',
        details: 'Oops! This user is not valid'
    });

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: req.body },
        { new: true }
    )
    console.log(`This is updated user ${updatedUser}`)
    if (updatedUser!.sex != "" || null && updatedUser!.dob != "" || null) {
        const userProfileComplete = await User.findByIdAndUpdate(
            req.user._id,
            { profile_completed: true }
        );
        return res.send(userProfileComplete)
    };
    res.send({
        message: 'User profile updated successfully',
        details: updatedUser
    });
}

export const confirmUserPassword = async (req: any, res: any) => {
    //validate data 
    const { error } = validatePassword(req.body);
    if (error) return res.status(400).send({
        validation_details: error.details[0].message
    });
    //check if user exists
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(400).send({
        message: 'Bad Request',
        details: 'Oops! This user is not valid'
    });
    //check if password provided to initiate update is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Incorrect Password');

    res.send({
        message: 'User password is confirmed',
        details: validPassword
    });
}

export const changePassword = async (req: any, res: any) => {

    //check if user exists
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(400).send({
        message: 'Bad Request',
        details: 'Oops! This user is not valid'
    });

    //check if old password provided to initiate update is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Incorrect Password');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

    const updatedPassword = await User.findByIdAndUpdate(
        req.user._id,
        { $set: { password: hashedPassword } },
        { new: true }
    );

    res.send({
        message: 'Password updated successfully',
        details: updatedPassword
    });
}

export const addAddress = async (req: any, res: any) => {
    const user = await User.findOne({ email: req.user.email });
    //check if user exists
    if (!user) return res.status(400).send({
        message: 'Bad Request',
        details: 'Oops! This user is not valid'
    });

    const addressObject = {
        address: req.body.address,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city
    }

    const newAddress = await User.findByIdAndUpdate(
        req.user._id,
        { $push: { address_list: addressObject } },
        { new: true, writeConcern: true }
    );

    res.send(newAddress)
}


export const updateAddress = async (req: any, res: any) => {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(400).send({
        message: 'Bad Request',
        details: 'Oops! This user is not valid'
    });


    const updatedAddress = await User.findOneAndUpdate({ 'address_list._id': req.params.id }, { 'address_list.$.address': req.body.address, 'address_list.$.country': req.body.country, 'address_list.$.state': req.body.state, 'address_list.$.city': req.body.city }, { new: true, runValidators: true });

    //const updatedAddress = await User.findByIdAndUpdate(req.user._id, {"address_list.$": req.body}, { new: true, runValidators: true }) 
    if (!updatedAddress) return res.status(404).send('Address not found');

    res.send({
        message: 'Address update successfully',
        details: updatedAddress
    });
}

export const deleteAddress = async (req: any, res: any) => {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(400).send({
        message: 'Bad Request',
        details: 'Oops! This user is not valid'
    });

    const removeAddress = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { address_list: { _id: req.params.id } } },
        { writeConcern: true, multi: true, new: true }
    );

    if (!removeAddress) return res.status(404).send({
        message: 'Bad Request: Cannot remove the address from list',
        details: "This address does not exist in address list"
    });

    res.send({
        message: 'address has been removed and address list is updated successfully!',
        details: removeAddress
    });
}
