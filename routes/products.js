import { Router } from 'express';
import { MongoClient } from 'mongodb';
import Product from '../models/product.js';

var router = Router();

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const database = client.db('web11');
const productsCollection = database.collection('products');

router.get('/men', async(req, res, next) =>{

  const products = await productsCollection.find({ 'category.0': true }).toArray();

  return res.render('products', {products: products});
});

router.get('/women', async(req, res, next) =>{

  const products = await productsCollection.find({ 'category.1': true }).toArray();

  return res.render('products', {products: products});
});

router.get('/kids', async(req, res, next) =>{

  const products = await productsCollection.find({ 'category.2': true }).toArray();

  return res.render('products', {products: products});
});

router.get('/shoes', async(req, res, next) =>{
  const products = await productsCollection.find({ type: 'Shoe' }).toArray();

  return res.render('products', {products: products});
});

router.get('/bags', async(req, res, next) =>{
  const products = await productsCollection.find({ type: 'Bag' }).toArray();

  return res.render('products', {products: products});
});

export default router;