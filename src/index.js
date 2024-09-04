import express from "express";
import dotenv from "dotenv";
dotenv.config({});

import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from "./db/index.js";
import userRoute from "./routes/user.routes.js";
import companyRoute from "./routes/company.routes.js";   
import jobRoute from "./routes/job.routes.js"
import applicationRoute from "./routes/application.routes.js"


const app = express();
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

const corsOptions = {
  origin:'http//localhost:5173',
  credentials:true
}

app.use(cors(corsOptions));

const PORT = process.env.PORT||3000 ;

//apis 
app.use("/api/v1/users",userRoute)
app.use("/api/v1/companies",companyRoute)
app.use("/api/v1/jobs",jobRoute)
app.use("/api/v1/applications",applicationRoute)

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});

