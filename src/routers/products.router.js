import { Router } from "express";
import errorHandler from '../services/errors/middlewares/index.js';
import {getProducts, saveProduct} from '../controllers/products.controllers.js';

const router = Router();
//
router.get("/", getProducts);
router.post("/", saveProduct);
router.use(errorHandler);

export default router;