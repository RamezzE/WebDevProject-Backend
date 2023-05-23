import { Router } from 'express';
import { MongoClient } from 'mongodb';
import Product from '../models/product.js';

var router = Router();

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const database = client.db('web11');
const productsCollection = database.collection('products');

router.get('/men', async (req, res, next) => {

  const products = await productsCollection.find({ 'category.0': true }).toArray();
  let admin = false;
  if (req.session.userType == 'admin')
    admin = true;
  return res.render('products', { products: products, admin: admin });
});

router.get('/women', async (req, res, next) => {

  const products = await productsCollection.find({ 'category.1': true }).toArray();
  let admin = false;
  if (req.session.userType == 'admin')
    admin = true;
  return res.render('products', { products: products, admin: admin });
});

router.get('/kids', async (req, res, next) => {

  const products = await productsCollection.find({ 'category.2': true }).toArray();
  let admin = false;
  if (req.session.userType == 'admin')
    admin = true;
  return res.render('products', { products: products, admin: admin });
});

router.get('/shoes', async (req, res, next) => {
  const products = await productsCollection.find({ type: 'Shoe' }).toArray();
  let admin = false;
  if (req.session.userType == 'admin')
    admin = true;
  return res.render('products', { products: products, admin: admin });
});

router.get('/bags', async (req, res, next) => {
  const products = await productsCollection.find({ type: 'Bag' }).toArray();
  let admin = false;
  if (req.session.userType == 'admin')
    admin = true;
  return res.render('products', { products: products, admin: admin });
});

export default router;