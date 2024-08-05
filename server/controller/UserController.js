import errorHandler from "../utils/errors.js";
import User from '../models/User.js'
import bcrypt from 'bcrypt'

export const updateProfile= async(req, res, next)=>{

    if(req.user.id !== req.params.id) return next(errorHandler(401, "Not authorize to update"))
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