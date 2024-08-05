import errorHandler from "../utils/errors.js";
import User from '../models/User.js'
import bcrypt from 'bcrypt'

// update user account
export const updateProfile= async(req, res, next)=>{

    if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account"))
    try {

        if(req.body.password){
            
            req.body.password = bcrypt.hashSync(req.body.password,10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:{
                username : req.body.username,
                email : req.body.email,
                avatar : req.body.avatar,
                password : req.body.password
            }
        },{new:true}) // new : true saves our new infromation else it will save previous value only

        const{password, ...rest} = updatedUser._doc;  // removing password from rest
        res.status(200).json(rest);

    } catch (error) {
        next(error);
    }
}

// delete user acoount
export const deleteUser = async(req, res, next)=>{
    if(req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your own account"))
    try {
        
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie("access_token")
        res.status(200).json({
            success:true,
            message:"User Account Deleted Successfully"
        })

    } catch (error) {
        next(error);
    }
}