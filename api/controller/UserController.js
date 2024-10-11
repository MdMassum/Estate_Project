import errorHandler from "../utils/errors.js";
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import Listing from "../models/Listing.js";

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

// get user listings
export const getUserListing = async(req,res,next)=>{

    if( req.params.id !== req.user.id) return next(errorHandler(401, "You can only view your own listings"))
    try {
        
        const listings = await Listing.find({userRef:req.params.id})
        res.status(200).json(listings);

    } catch (error) {
        next(error);
    }
}
export const getUser = async(req,res,next)=>{
    try {
        const user = await User.findById(req.params.id);
        
        if(!user){
            return errorHandler(404, "User Not Found");
        }
        const{password:pass, ...rest} = user._doc;  // removing password from rest
        res.status(200).json(rest);

    } catch (error) {
        
    }
}