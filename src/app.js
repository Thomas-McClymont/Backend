import express from 'express';
import config from './config/config.js';
import compressionRouter from './routers/compression.router.js'
import productsRouter from './routers/products.router.js'
import compression from 'express-compression';

const app = express();

//JSON settings:
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(compression({
    brotli: {enabled: true, zlib: {}}
}));

//Declare routers:
app.use("/compression", compressionRouter);
app.use("/api/products", productsRouter);

const SERVER_PORT = config.port;
app.listen(SERVER_PORT, () => {
    console.log("Servidor escuchando por el puerto: " + SERVER_PORT);
});