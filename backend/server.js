import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import db from './utils/db.js';
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";

dotenv.config();


const app = express();
app.use(express.json());
app.use(cookieParser());


 const port = process.env.PORT || 4000;

// app.use(
//   cors({
//     origin: process.env.BASE_URL,
//     credentials: true,
//     methods: ["GET", "POST", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials:true
}))


app.get('/', (req, res) => {
    res.send('SafeStream Backend is running!');
});



//connect db
db();

// routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoutes);



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});