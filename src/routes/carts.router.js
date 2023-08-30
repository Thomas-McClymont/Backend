import { Router } from "express";
import CartManager from "../dao/CartManager.js";

const cartsRouter = Router();
const CM = new CartManager();

cartsRouter.post("/", async (req, res) => {
    const newCart = await CM.newCart();
    if (newCart) {
        res.send({status:"ok", message:"Cart created succesfully!"});
    } else {
        res.status(500).send({status:"error", message:"Error! Failed creating cart!"});
    }
});

cartsRouter.get("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const cart = await CM.getCart(cid);
    if (cart) {
        res.send({products:cart.products});
    } else {
        res.status(400).send({status:"error", message:"Error! Cart Id not found!"});
    }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await CM.addProductToCart(cid, pid);

    if (result) {
        res.send({status:"ok", message:"Product added to cart!"});
    } else {
        res.status(400).send({status:"error", message:"Error! Product adding failed!"});
    }
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const result = await CM.updateQuantityProductFromCart(cid, pid, quantity);

    if (result) {
        res.send({status:"ok", message:"Product update complete!"});
    } else {
        res.status(400).send({status:"error", message:"Error! Product update failed!"});
    }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const result = await CM.deleteProductFromCart(cid, pid);

    if (result) {
        res.send({status:"ok", message:"Product deleted!"});
    } else {
        res.status(400).send({status:"error", message:"Error! Product deletion failed!"});
    }
});

cartsRouter.delete("/:cid", async (req, res) => {
    const cid = req.params.cid;
    const result = await CM.deleteProductsFromCart(cid);

    if (result) {
        res.send({status:"ok", message:"Cart emptied!"});
    } else {
        res.status(400).send({status:"error", message:"Error! Emptying failed!"});
    }
});

export default cartsRouter;