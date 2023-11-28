import ProductDTO from "../dto/Product.dto.js";
import { productsService } from "../services/index.js"
import __dirname from "../utils/index.js";

const getAllProducts = async(req,res)=>{
    const products = await productsService.getAll();
    res.send({status:"success",payload:products})
}

const createProduct = async(req,res)=> {
    const {name,specie,birthDate} = req.body;
    if(!name||!specie||!birthDate) return res.status(400).send({status:"error",error:"Incomplete values"})
    const product = ProductDTO.getProductInputFrom({name,specie,birthDate});
    const result = await productsService.create(product);
    res.status(201).send({status:"success",payload:result})
}

const updateProduct = async(req,res) =>{
    const productUpdateBody = req.body;
    const productId = req.params.pid;
    const result = await productsService.update(productId,productUpdateBody);
    res.send({status:"success",message:"product updated"})
}

const deleteProduct = async(req,res)=> {
    const productId = req.params.pid;
    const result = await productsService.delete(productId);
    res.send({status:"success",message:"product deleted"});
}

export default {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct
}