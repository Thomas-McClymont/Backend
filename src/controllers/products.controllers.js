import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/errors-enum.js";
import { generateProductErrorInfo } from "../services/errors/messages/product-creation-error.message.js";

import {generateProduct} from '../utils.js';
import {generateUser} from '../utils.js'

export const getProducts = async (req, res) => {
    try {
        let products = [];
        for (let i = 0; i < 100; i++) {
            products.push(generateUser());
        }
        res.send({status: "success", payload: products});
    } catch (error) {
        console.error(error);
        res.status(500).send({error:  error, message: "No se pudo obtener los productos:"});
    }
};

export const saveProduct = (req, res) => {
    console.log(req.body);
    const {product_name} = req.body;
    if (!product_name) {
        //Create Custom Error
        CustomError.createError({
            name: "Product Creation Error",
            cause: generateProductErrorInfo({product_name}),
            message: "Error tratando de crear el producto",
            code: EErrors.INVALID_TYPES_ERROR
        });
    }
    const productDto = {
        product_name
    }
    if (product.length === 0) {
        productDto.id = 1;
    } else {
        productDto.id = product[product.length-1].id + 1;
    }
    product.push(productDto);
    res.status(201).send({status: "success", payload: productDto});
}