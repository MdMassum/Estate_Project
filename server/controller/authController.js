import User from '../models/User.js'
import bcrypt from 'bcrypt'


export const SignUp = async(req, res, next) =>{
    const {username,email,password} = req.body;
    console.log(password);
    let success = false;

    try {

        if(await User.findOne({email})){         // email already exists -->
            return res.status(400).json({ success,error: "Sorry!! User with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);  // salt for adding in password
        const secPassword = await bcrypt.hash(password, salt); 
        // Hashing password  or simply do bcrypt.hash(req.body.password,10);
        console.log({password})
        const newUser = await User.create({username, email, password:secPassword})

        success = true;
        res.json({success, newUser}); // Return the JWT to the client upon successful user creation

    } catch (error) {
        next(error);
    }    
}