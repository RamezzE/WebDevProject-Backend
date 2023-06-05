import { MongoClient } from 'mongodb';
import { Router } from 'express';
import DashboardController from '../controllers/Dashboard.controller.js'; 
import dotenv from 'dotenv';
dotenv.config({ path: './.env' })
import multer from "multer";
var router = Router();

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const database = client.db('web11');
const usersCollection = database.collection('users');
const productsCollection = database.collection('products');
const ascendingOrder = { price: 1 };

router.use((req, res, next) => {
  if (req.session.userType != 'admin')
    res.redirect('/');
  else
    next();
});

router.get('/', async (req, res, next) => {
  console.log(req.session.firstName); // debugging purposes
  return res.render('dashboard', { currentTab: 'home', firstName: req.session.firstName });
});

router.get('/users', DashboardController.searchUsers);

router.post('/users/delete', DashboardController.deleteUser);

router.post('/users/makeAdmin', DashboardController.makeAdmin);

router.get('/insights', async (req, res, next) => {
  return res.render('dashboard', { currentTab: 'insights' });
});

router.get('/products', DashboardController.searchProducts);

router.post('/products/addProduct', DashboardController.addProduct);

router.post('/products/checkProductID', DashboardController.checkProductID);

router.post('/products/editProduct', DashboardController.editProduct);

router.post('/products/delete', DashboardController.deleteProduct);

export default router;