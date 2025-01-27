import express from 'express'
import morgan from 'morgan'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import authRoutes from "./src/routes/auth.routes.js";
import activities from "./src/routes/activities.routes.js"
import users from "./src/routes/users.routes.js"
import dpt from "./src/routes/dpt.routes.js"
import category from "./src/routes/category.routes.js"
import entity from './src/routes/entity.routes.js'
import schedule from './src/routes/schedule.routes.js'
import schools from './src/routes/schools.routes.js'
import visits from './src/routes/visits.routes.js'
import media from './src/routes/media.routes.js'    
import role from './src/routes/roles.routes.js'
import reports from './src/routes/reports.routes.js'
import cron from 'node-cron'



dotenv.config()
const app = express()

const corsOptions = {
    origin: process.env.FRONT_URL,
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}



app.use(cors(corsOptions));
app.use(morgan("common"));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
/* app.use(express.static('public')); */


const connectToMongo = async () => {
    try {
        mongoose.set("strictQuery", false);
        mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to Mongo Successfully!");
    } catch (error) {
        console.log(error);
    }
};
connectToMongo()

app.use('/api/images', express.static('public/images'));
app.use("/api/auth", authRoutes)
app.use("/api", activities);
app.use("/api", users);
app.use("/api", dpt);
app.use("/api", category);
app.use("/api", entity);
app.use("/api", schedule);
app.use("/api", schools);
app.use("/api", visits);
app.use("/api", media);
app.use("/api", role);
app.use("/api", reports);


app.listen(process.env.PORT || 8800, () => {
    console.log("Backend server is running on port", process.env.PORT || 8800)
})


