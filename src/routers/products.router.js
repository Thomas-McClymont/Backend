import { Router } from "express";
import { getProducts } from '../controllers/products.controllers.js';
import errorHandler from '../services/errors/middlewares/index.js';

const router = Router();

router.get("/", getProducts);
router.use(errorHandler);

export default router;