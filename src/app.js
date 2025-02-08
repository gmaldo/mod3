import express from 'express';
import mongoose from 'mongoose';
import MongoSingleton from './config/mongodb-singleton.js';
import cookieParser from 'cookie-parser';
import config from './config/config.js';
import __dirname from './utils.js'
import handlebars from 'express-handlebars';


import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js'
import viewsRouter from './routes/views.router.js'

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express';

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

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de Adopción de Mascotas',
            description: 'API para la gestión de adopciones de mascotas'
        }
    },
    apis: ['./docs/**/*.yaml']
}
const spects = swaggerJsDoc(swaggerOptions)
//declare swagger endpoint
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(spects))

app.use(express.json());
app.use(cookieParser());

// confi de hbs
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);
app.use('/api/mocks', mocksRouter)
app.use('/',viewsRouter)

app.listen(PORT,()=>console.log(`Listening on ${PORT}`))
