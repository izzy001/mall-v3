//update user data 
//user should include: DOB, phone number
//execute using patch method to update user collection 

import { User, validateUserUpdate } from '../models/user.model';

//update user profile
export const updateUserProfile = async (req: any, res: any) => {
    //authenticate user data via AuthMiddleware

    //validate data 
    const { error } = validateUserUpdate(req.body);
    if (error) return res.status(400).send({
        validation_details: error.details[0].message
    });
    //check if user exists
    const user= await User.findOne({email: req.user.email});
    if(!user) return res.status(400).send('Oops! The email provided is not valid')
    //check if password provided to initiate update is correct
    // const validPassword = await bcrypt.compare(req.body.password, user.password);
    // if (!validPassword) return res.status(400).send('Incorrect Password');

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: req.body},
        {new: true}
    )
    console.log(`This is updated user ${updatedUser}`)
   if(updatedUser!.sex != ""||null && updatedUser!.dob != ""||null){
       const userProfileComplete = await User.findByIdAndUpdate(
           req.user._id,
           {profile_completed: true}
       );
       return res.send(userProfileComplete)
   };
 res.send(updatedUser);
}
