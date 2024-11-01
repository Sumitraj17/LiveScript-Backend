import jwt from "jsonwebtoken"
import {config} from "dotenv"
import User from "../models/userModel.js"
config()

const verifyToken = async(req,res,next)=>{
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");

    if(!token)
        return res.status(403).json({status:'error',message:'Unauthorized access'});

    const decode = jwt.verify(token,process.env.SECRET_KEY);

    const user = await User.findById(decode.id).select(" -password -refreshToken");

    if(!user)
        return res.status(403).json({status:'error',message:'Unauthorized access'});

    req.user = user;
    next();
}

export default verifyToken;
