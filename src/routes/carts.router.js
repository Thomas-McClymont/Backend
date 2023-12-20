import { Router } from 'express';
import cartsController from '../controllers/carts.controllers.js';

const router = Router();

router.get('/',cartsController.getAllCarts);
router.get('/:aid',cartsController.getCart);
router.post('/:uid/:pid',cartsController.createCart);

export default router;