import express from 'express';
import mongoose from 'mongoose';
import MongoSingleton from './config/mongodb-singleton.js';
import cookieParser from 'cookie-parser';
import config from './config/config.js';


import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js'

const app = express();
const PORT = config.port//process.env.PORT||8080;

const mongoInstance = async () => {
    try {
        await MongoSingleton.getInstance();
    } catch (error) {
        console.error(error);
    }
};
mongoInstance();


app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks', mocksRouter)

app.listen(PORT,()=>console.log(`Listening on ${PORT}`))
