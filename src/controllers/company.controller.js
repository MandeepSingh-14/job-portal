import { Company } from "../models/company.model.js";


const registerCompany = async(req,res) => {
    try{
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

const getCompany = async (req, res) => {
    try {
        const userId = req.id;

        console.log("User ID:", userId); // Debugging output to check the userId

        const companies = await Company.find({ userId: userId });

        if (companies.length === 0) { // Check if the array is empty
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Companies fetched",
            companies,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while fetching companies.",
            success: false
        });
    }
};



const getCompanybyID = async (req,res)=>{
    try{
        const companyId = req.params.id
        const companies = await Company.findById(companyId)
        if(!companies){
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }

        return res.status(200).json({
            message:"Companies fetched",
            companies,
            success: true
        })
    }catch(error){
        console.log(error)
    }
}

const updatedCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const companyId = req.params.id; // Get company ID from route parameters

        const company = await Company.findByIdAndUpdate(
            companyId,
            {
                name,
                description,
                website,
                location
            },
            { new: true } // To return the updated document
        );

        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company data updated successfully.",
            company,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred while updating the company",
            success: false
        });
    }
};

export{
    registerCompany,
    getCompany,
    getCompanybyID,
    updatedCompany
}