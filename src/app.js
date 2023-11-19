import mongoose from 'mongoose';
import express from 'express';
import cookieParser from 'cookie-parser';

import config from './config/config.js';

//import productsRouter from './routers/products.router.js'
import usersRouter from './routers/users.router.js';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express';

const app = express();

//Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentacion API Adoptme",
            description: "Documentacion para uso de swagger"
        }
    },
    apis: [`./src/docs/**/*.yaml`]//Corregir ruta a todos los archivos .yaml
};
const specs = swaggerJSDoc(swaggerOptions);

//Declare swagger api endpoint 
app.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs));

//JSON settings:
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({extended:true}));

//Declare routers:
app.use('/api/users',usersRouter);
//app.use("/api/products", productsRouter);

const SERVER_PORT = config.port;
app.listen(SERVER_PORT, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});