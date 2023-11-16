import { Router } from "express";
//import { getProducts } from '../controllers/products.controllers.js';
import errorHandler from '../services/errors/middlewares/index.js';
//
import {getUsers} from '../controllers/products.controllers.js';
const router = Router();

//
router.get("/", getUsers);

//router.get("/", getProducts);
router.use(errorHandler);

export default router;