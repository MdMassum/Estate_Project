import { mongoose } from "mongoose";
import validator from 'validator'

const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        minLength:[4,"Name should be atleast 4 characters"],
        maxLength:[30,"Name should not exceed 30 characters"],
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,"Please Enter a valid Email"]
    },
    password:{
        type:String,
        required:true,
        minLength:[8,"Password should be atleast 8 characters"],
    },
    avatar:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
},{timestamps : true})

// timestamps adds creation and updation date automatically
const User = mongoose.model('User',UserSchema);
export default User;