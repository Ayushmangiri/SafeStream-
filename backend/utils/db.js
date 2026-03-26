import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();



const db = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
        console.log("MongoDB Connection Failed");
        process.exit(1);
    }
};

export default db;