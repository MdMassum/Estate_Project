import User from '../models/User.js'
import bcrypt from 'bcrypt'
import errorHandler from '../utils/errors.js'
import jwt from 'jsonwebtoken'


export const SignUp = async(req, res, next) =>{
    const {username,email,password} = req.body;
    let success = false;

    try {

        if(await User.findOne({email})){         // email already exists -->
            return next(errorHandler(400,"Email already Exists"));
        }

        const salt = await bcrypt.genSalt(10);  // salt for adding in password
        const secPassword = await bcrypt.hash(password, salt); 
        // Hashing password  or simply do bcrypt.hash(req.body.password,10);
        const newUser = await User.create({username, email, password:secPassword})

        success = true;
        console.log(newUser);
        res.json({success, newUser}); // Return the JWT to the client upon successful user creation

    } catch (error) {
        console.log(error);
        next(error);
    }    
}

export const SignIn = async(req, res, next) =>{
    const {email, password} = req.body;
    let success = false;

    try {
        let user = await User.findOne({email})
        if(!user){
            return next(errorHandler(404, "Invalid Credentials !!"))
        }
        const passwordComp = await bcrypt.compare(password,user.password);
        if(!passwordComp){
            return next(errorHandler(400, "Invalid Credentials !!"))
        }

        const payload = {
            user: {
                id: user._id 
            }
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        success = true;
        
        const {password:pass, ...rest} = user._doc;  // for removing password field and sending rest 
        console.log(rest);
        res.cookie('access_token',token,{httpOnly:true})
        .status(200)
        .json({success,rest});

    } catch (error) {
        console.log(error);
        next(error)
    }
}