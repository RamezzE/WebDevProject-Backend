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

export default router;