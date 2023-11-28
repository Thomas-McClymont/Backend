import { Router } from 'express';
import productsController from '../controllers/products.controllers.js';
import uploader from '../utils/uploader.js';

const router = Router();

router.get('/',productsController.getAllProducts);
router.post('/',productsController.createProduct);
router.put('/:pid',productsController.updateProduct);
router.delete('/:pid',productsController.deleteProduct);

export default router;