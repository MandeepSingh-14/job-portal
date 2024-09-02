import {User} from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';


const registerUser = async(req,res) => {
    try{
        const {fullname,email,phoneNumber,password,role} = req.body;
        if(
            [fullname,email,phoneNumber,password,role].some((field) =>
            field?.trim() ==="") // check ki field ko trim kr dijiye bt age uske baad bhi vo true bheja to khali tha 
        )
        {
            return res.status(400).json({
                message:'something is missing',
                success:false
            });
        };
        const existedUser = await User.findOne({email})
        if(existedUser){
            return res.status(400).json({
                message:'User already registered',
                success:false
        })
    }
    const hashedPassword = await bcrypt.hash(password,10);

    await User.create({
        fullname,
        email,
        phoneNumber,
        password : hashedPassword,
        role,
        // profile:{
        //     profilePhoto:cloudresponse
        // }
    })

    return res.status(201).json({
        message: "Account created successfully.",
        success: true
    });
}catch(error){
    console.log(error);
}
}

const loginUser = async(req,res) => {
    try {
        const{email,password,role} =req.body;
        if(!email || !password || role)
        {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }
        let user = await User.findOne({email})
            if (!user) {
                return res.status(400).json({
                    message: "Incorrect email or password.",
                    success: false,
                })
            }

        const isPasswordMatch = await bcrypt.compare(password,user.password);
            if (!isPasswordMatch) {
                return res.status(400).json({
                    message: "Incorrect email or password.",
                    success: false,
                })
            };

        if(role !== user.role)
        {
            return res.status(400).json({
                message: "Check your role again",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }

        const token = await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn: '1d'});        

        return res.status(200).cokkie("token", token, {
            maxAge:1*24*60*60*1000 , httpsOnly:true , sameStrict :'strict'
        }).json({
            message: "User Login successfully",
                success: true,
        })
     } catch (error) {
        console.log(error)
    }
}

const logoutUser = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

const updateAccountDetails = (async (req,res) => {
    try{
    const {fullName,email ,phoneNumber,bio,skills} = req.body

    if(!fullName || !email || !phoneNumber || !bio || !skills ){
        return res.status(400).json({
            message: "All firlds are required",
            success: false
        })
    }

    const skillArray = skills.split(',')
///user gettong updated 
    const user = User.findById(
        req.user?._id,
        {
            $set: {
                fullName :fullName,
                email: email,
                phoneNumber:phoneNumber,
                bio :bio,
                skills: skillArray,

            }
        },
        {new: True}
    ).select("-password")

    await user.save();
    user = {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile
    }

    return res.status(200).json({
        message:"Profile updated successfully.",
        user,
        success:true
    })
}catch(error){
    console.log(error)
}
}); 




export {
    registerUser,
    loginUser,
    logoutUser,
    updateAccountDetails
}