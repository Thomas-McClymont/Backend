import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';

import config from './config/config.js';

import usersRouter from './routes/users.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import sessionsRouter from './routes/sessions.router.js'

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express';

const app = express();
const PORT = process.env.PORT||9090;
const connection = mongoose.connect(config.mongoUrl);

//Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion API NombreProyect",
            description: "Documentacion para uso de swagger"
        }
    },
    apis: [`./src/docs/**/*.yaml`]
};
const specs = swaggerJSDoc(swaggerOptions);

//Declare swagger api endpoint 
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs));

app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);
app.use('/api/sessions',sessionsRouter);

const SERVER_PORT = config.port;
app.listen(SERVER_PORT, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});