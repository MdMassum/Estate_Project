import { mongoose } from "mongoose";

const UserSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps : true})

// timestamps adds creation and updation date automatically
const User = mongoose.model('User',UserSchema);
export default User;