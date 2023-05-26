import { Router } from 'express';
import ProductController from '../controllers/Products.controller.js'

var router = Router();

router.get('/men', ProductController.menProducts);

router.get('/women', ProductController.womenProducts);

router.get('/kids', ProductController.kidsProducts);

router.get('/shoes', ProductController.shoesProducts);

router.get('/bags', ProductController.bagsProducts);

router.get('/filter', ProductController.filterProducts)

router.get('/:id', ProductController.productDetails);

export default router;