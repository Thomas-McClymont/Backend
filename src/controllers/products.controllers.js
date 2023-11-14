import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/errors-enum.js";
import { generateProductErrorInfo, getProductByIdErrorInfo } from "../services/errors/messages/product-creation-error.message.js";

const products = [];

export const getProducts = (req, res) => {
    try {
        res.send({message: "Success!", payload: products});
    } catch (error) {
        console.error(error);
        res.status(500).send({error:  error, message: "No se pudo obtener los productos."});
    }
}

export const saveProduct = (req, res) => {
        console.log(req.body);
        const {product_name, price, stock, image} = req.body;
        if (!product_name) {
            //Custom Error
            CustomError.createError({
                name: "Product Creation Error",
                cause: generateProductErrorInfo({product_name, price, stock, image}),
                message: "Error tratando de crear producto",
                code: EErrors.INVALID_TYPES_ERROR
            });
        }
        const productDto = {
            product_name,
            price, 
            stock,
            image
        }
        if (products.length === 0) {
            productDto.id = 1;
        } else {
            productDto.id = products[products.length-1].id + 1;
        }
        products.push(productDto);
        res.status(201).send({status: "success", payload: productDto});
}

export const getProductById = (req, res) => {
    console.log(`Entrando a get product by id, buscando por id: ${req.params.uid}`);
    console.log(parseInt(req.params.uid));
    if(!req.params.uid || isNaN(parseInt(req.params.uid))){
        console.log("Generando error custom");
        //Custom Error
        CustomError.createError({
            name: "Product Get By Id Error",
            cause: getProductByIdErrorInfo(req.params.uid),
            message: "Error tratando de obtener producto",
            code: EErrors.INVALID_PARAM
        });
    }
    res.send({message: "Success!", payload: products});
}