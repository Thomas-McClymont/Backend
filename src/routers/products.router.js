import { Router } from "express";
import { getProducts, saveProduct, getProductById } from '../controllers/products.controller.js';
import errorHandler from '../services/errors/middlewares/index.js';

const router = Router();

router.get("/", getProducts);
router.post("/", saveProduct);
router.get("/:uid", getProductById);
router.use(errorHandler);

export default router;