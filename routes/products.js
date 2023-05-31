import { Router } from 'express';
import ProductController from '../controllers/Products.controller.js'

var router = Router();

router.get('/', ProductController.searchProducts);

router.get('/:id', ProductController.productDetails);

export default router;