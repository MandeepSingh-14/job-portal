import { Job } from "../models/job.model.js";
import mongoose from "mongoose";

const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, experienceLevel, location, jobType, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !experienceLevel || !location || !jobType || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        }

        const job = await Job.create({  // Add await here
            title, 
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            experienceLevel,
            location,
            jobType,
            position: Number(position),
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while creating the job.",
            success: false
        });
    }
};


const getAllJob = async(req,res) => {
    try {
        const keyword = req.query.keyword || " ";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

const getJobById = async (req,res) => {
    try {
        
        const jobId = req.params.id;
        //console.log(jobId)
        const job = await Job.findById(jobId)

        if (!job) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
    }
};

const getAdminJobs = async (req, res) => {
    try {
        
        const adminId = req.id;
        //console.log(adminId)
        const jobs = await Job.find({created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export{
    postJob,
    getAllJob,
    getJobById,
    getAdminJobs
}
