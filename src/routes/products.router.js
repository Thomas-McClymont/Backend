import { Router } from "express";
import ProductManager from "../dao/ProductManager.js";

const productsRouter = Router();
const PM = new ProductManager();

productsRouter.get("/", async (req, res) => {
    const products = await PM.getProducts(req.query);

    res.send({products});
});

productsRouter.get("/:pid", async (req, res) => {
    let pid = req.params.pid;
    const products = await PM.getProductById(pid);
    
    res.send({products});
});

productsRouter.post("/", async (req, res) => {
    let {title, description, code, price, status, stock, category, thumbnails} = req.body;

    if (!title) {
        res.status(400).send({status:"error", message:"Error! Complete field: Title!"});
        return false;
    }

    if (!description) {
        res.status(400).send({status:"error", message:"Error! Complete field: Description!"});
        return false;
    }

    if (!code) {
        res.status(400).send({status:"error", message:"Error! Complete field: Code!"});
        return false;
    }

    if (!price) {
        res.status(400).send({status:"error", message:"Error! Complete field: Price!"});
        return false;
    }

    status = !status && true;

    if (!stock) {
        res.status(400).send({status:"error", message:"Error! Complete field: Stock!"});
        return false;
    }

    if (!category) {
        res.status(400).send({status:"error", message:"Error! Complete field: Category!"});
        return false;
    }

    if (!thumbnails) {
        res.status(400).send({status:"error", message:"Error! Complete field: Thumbnails!"});
        return false;
    } else if ((!Array.isArray(thumbnails)) || (thumbnails.length == 0)) {
        res.status(400).send({status:"error", message:"Error! Insert image in: Array Thumbnails!"});
        return false;
    }

    const result = await PM.addProduct({title, description, code, price, status, stock, category, thumbnails}); 

    if (result) {
        res.send({status:"ok", message:"Product added succesfully!"});
    } else {
        res.status(500).send({status:"error", message:"Error! Product adding failed!"});
    }
});

productsRouter.put("/:pid", async (req, res) => {
    let pid = req.params.pid;
    let {title, description, code, price, status, stock, category, thumbnails} = req.body;

    if (!title) {
        res.status(400).send({status:"error", message:"Error! Complete field: Title!"});
        return false;
    }

    if (!description) {
        res.status(400).send({status:"error", message:"Error! Complete field: Description!"});
        return false;
    }

    if (!code) {
        res.status(400).send({status:"error", message:"Error! Complete field: Code!"});
        return false;
    }

    if (!price) {
        res.status(400).send({status:"error", message:"Error! Complete field: Price!"});
        return false;
    }

    status = !status && true;

    if (!stock) {
        res.status(400).send({status:"error", message:"Error! Complete field: Stock!"});
        return false;
    }

    if (!category) {
        res.status(400).send({status:"error", message:"Error! Complete field: Category!"});
        return false;
    }

    if (!thumbnails) {
        res.status(400).send({status:"error", message:"Error! Complete field: Thumbnails!"});
        return false;
    } else if ((!Array.isArray(thumbnails)) || (thumbnails.length == 0)) {
        res.status(400).send({status:"error", message:"Error! Insert image in: Array Thumbnails!"});
        return false;
    }

    const result = await PM.updateProduct(pid, {title, description, code, price, status, stock, category, thumbnails});

    if (result) {
        res.send({status:"ok", message:"Product updated!"});
    } else {
        res.status(500).send({status:"error", message:"Error! Product update failed!"});
    }
});

productsRouter.delete("/:pid", async (req, res) => {
    let pid = req.params.pid;
    const result = await PM.deleteProduct(pid)

    if (result) {
        res.send({status:"ok", message:"Product deleted!"});
    } else {
        res.status(500).send({status:"error", message:"Error! Product deletion failed!"});
    }
});

export default productsRouter;