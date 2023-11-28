import { Router } from 'express';
import cartsController from '../controllers/carts.controllers.js';

const router = Router();

router.get('/',cartsController.getAllAdoptions);
router.get('/:aid',cartsController.getAdoption);
router.post('/:uid/:pid',cartsController.createCart);

export default router;