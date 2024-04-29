import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';


import authRouter from './routers/authRouter';
import taskRouter from './routers/taskRouter';
import connectDB from './db';

dotenv.config(); 
connectDB();

const app = express();
const port = 4000;
app.use(cors());


app.use(bodyParser.json());
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/task', taskRouter);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
