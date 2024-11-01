import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {config} from 'dotenv'
config();

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
        index: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    refreshToken: {
        type: String,
        default: null
    }
}, { timestamps: true }); 


userSchema.methods.hashPassword = async(password)=>{
    const salt = 10;
    try {
        const hashedPassword = await bcrypt.hash(password,salt)
        return hashedPassword;
    } catch (error) {
        console.log("Invalid Password",error)
        throw error
    }
}

userSchema.methods.verifyPassword = async(password)=>{
    try {
        const isMatch = await bcrypt.compare(this.password, password);
        return isMatch;
      } catch (error) {
        console.error("Invalid password:", error);
        return false; 
      }
}

export default mongoose.model("User", userSchema);
