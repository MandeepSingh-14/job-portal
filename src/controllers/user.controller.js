import {User} from "../models/user.model.js";
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

const loginUser = async(req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        if (role !== user.role) {
            return res.status(400).json({
                message: "Check your role again",
                success: false
            });
        }

        const tokenData = {
            userId: user._id
        };

        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true, 
            sameSite: 'strict'
        }).json({
            message: "User logged in successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

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

const updateAccountDetails = async (req, res) => {
    try {
        console.log("req.user:", req.user);

        const { fullname, email, phoneNumber } = req.body;

        if (!fullname || !email || !phoneNumber) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            {
                fullname,
                email,
                phoneNumber,
            },
            { new: true } // To return the updated document
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while updating the profile",
            success: false
        });
    }
};
const updateBio = async (req, res) => {
    try {
        console.log("req.user:", req.user);

        const { bio } = req.body;

        if (!bio) {
            return res.status(400).json({
                message: "Bio is required",
                success: false
            });
        }

        const updatedBio = await User.findByIdAndUpdate(
            req.user?._id,
            {
                "profile.bio" : bio
            },
            { new: true } // To return the updated document
        ).select("-password");

        if (!updatedBio) {
            return res.status(404).json({
                message: "Bio not updated",
                success: false
            });
        }

        return res.status(200).json({
            message: "Bio updated successfully.",
            user: updatedBio,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while updating the bIO",
            success: false
        });
    }
};
const updateSkills = async (req,res) =>{
    try{
    const skills = req.body;

    if (!skills) {
        return res.status(400).json({
            message: "Skills is required",
            success: false
        });
    }
    let skillsarray;
    if(skills)
    {
        skillsarray = skillsArray = skills.split(",").map(skill => skill.trim());
    }

    const updatedSkills = await User.findByIdAndUpdate(
        req.user?._id,
        {
            skillsarray
        },
        { new: true } // To return the updated document
    ).select("-password");
    if (!updatedSkills) {
        return res.status(404).json({
            message: "Skills not updated",
            success: false
        });
    }

    return res.status(200).json({
        message: "Skills updated successfully.",
        user: updatedSkills,
        success: true
    });
} catch (error) {
    console.log(error);
    return res.status(500).json({
        message: "An error occurred while updating the Skills",
        success: false
    });
}
}
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: "Old and new passwords are required",
                success: false
            });
        }

        const user = await User.findById(req.user?._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Old password is incorrect",
                success: false
            });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({
            message: "Password changed successfully",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while changing the password",
            success: false
        });
    }
};




export {
    registerUser,
    loginUser,
    logoutUser,
    updateAccountDetails,
    updateBio,
    updateSkills,
    changePassword
}