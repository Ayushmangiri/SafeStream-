import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';


const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('SafeStream Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});