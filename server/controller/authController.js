import User from '../models/User.js'
import bcrypt from 'bcrypt'
import errorHandler from '../utils/errors.js'
import jwt from 'jsonwebtoken'

// creating signUp function -->
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
        res.json({success, newUser}); // Return the JWT to the client upon successful user creation

    } catch (error) {
        next(error);
    }    
}

// creating sign In fuction
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
    
        res.cookie('access_token',token,{httpOnly:true})
        .status(200)
        .json(rest);

    } catch (error) {
        next(error)
    }
}

// creating sign in using google function
export const Google = async(req,res,next)=>{
    const {username, email, photo} = req.body;
    let success = false;

    try {
        let user = await User.findOne({email})
        if(user){  // if user exists means we have to create token and login -->
            const payload = {
                user: {
                    id: user._id 
                }
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET);
            success = true;
            
            const {password:pass, ...rest} = user._doc;  // for removing password field and sending rest 

            res.cookie('access_token',token,{httpOnly:true})
            .status(200)
            .json(rest);
        }
        else{  // user is not registered we have to create new

            // while using google for authentication we dont get password so we need to generate by ourself
            // Below code generates random num from 0 to 9 and char a to z in form 0.kd80ioe7 so total 16 digit
            const generatePassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const salt = await bcrypt.genSalt(10);  // salt for adding in password
            const hashPassword = await bcrypt.hash(generatePassword, salt);

            const user = await User.create({username, email, password:hashPassword, avatar:photo})

            // create token for direct login
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
            success = true;
            
            const {password:pass, ...rest} = user._doc;  // for removing password field and sending rest 

            res.cookie('access_token',token,{httpOnly:true})
            .status(200)
            .json(rest);  
        }
    } catch (error) {
        next(error)
    }
}

// logout functionality
export const signOut=async(req,res,next)=>{
    try {
        res.clearCookie('access_token');
        res.status(200).json("User has been logged Out")
    } catch (error) {
        next(error);
    }
}

