import { cartsService, productsService } from "../services/index.js"

const getAllCarts = async(req,res)=>{
    const result = await cartsService.getAll();
    res.send({status:"success",payload:result})
}

const getCart = async(req,res)=>{
    const cartId = req.params.aid;
    const cart = await cartsService.getBy({_id:cartId})
    if(!cart) return res.status(404).send({status:"error",error:"Cart not found"})
    res.send({status:"success",payload:cart})
}

const createCart = async(req,res)=>{
    const {uid,pid} = req.params;
    const user = await usersService.getUserById(uid);
    if(!user) return res.status(404).send({status:"error", error:"user Not found"});
    const product = await productsService.getBy({_id:pid});
    if(!product) return res.status(404).send({status:"error",error:"Product not found"});
    if(product.added) return res.status(400).send({status:"error",error:"Product has already been added"});
    user.products.push(product._id);
    await usersService.update(user._id,{products:user.products})
    await productsService.update(product._id,{added:true,owner:user._id})//
    await cartsService.create({owner:user._id,product:product._id})
    res.send({status:"success",message:"Product added"})
}

export default {
    createCart,
    getAllCarts,
    getCart
}