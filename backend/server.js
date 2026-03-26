import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import db from './utils/db.js';
import userRoutes from "./routes/user.routes.js";

dotenv.config();


const app = express();
app.use(express.json());
app.use(cookieParser());


 const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.get('/', (req, res) => {
    res.send('SafeStream Backend is running!');
});



//connect db
db();

//import routes
app.use("/api/v1/users", userRoutes);



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});