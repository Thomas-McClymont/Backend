import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/errors-enum.js";
import { generateProductErrorInfo, getProductByIdErrorInfo } from "../services/errors/messages/product-creation-error.message.js";

import generateProduct from '../utils.js';

const products = [];

export const getProducts = (req, res) => {
    try {
        for (let i = 0; i < 100; i++){
            products.push(generateProduct());
        }
        res.send({message: "Success!", payload: products});
    } catch (error) {
        console.error(error);
        res.status(500).send({error:  error, message: "No se pudo obtener los productos."});
    }
}