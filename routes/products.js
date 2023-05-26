import { Router } from 'express';
import { MongoClient } from 'mongodb';
import Product from '../models/product.js';

var router = Router();

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const database = client.db('web11');
const productsCollection = database.collection('products');
let admin = false;

router.use((req, res, next) => {
  if (req.session.userType == 'admin')
    admin = true;
  
  next();
});

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

router.get('/filter', async (req, res, next) => {
  if (req.query.men) {
    delete req.query.men;
    req.query['category.0'] = true;
  }
  if (req.query.women) {
    delete req.query.women;
    req.query['category.1'] = true;
  }
  if (req.query.kids) {
    delete req.query.kids;
    req.query['category.2'] = true;
  }

  let type = [];
  if (req.query.shoes) {
    delete req.query.shoes;
    type.push('Shoe');
  }
  if (req.query.bags) {
    delete req.query.bags;
    type.push('Bag');
  }

  req.query.type = { $in: type };

  console.log(req.query);
  
  let productsToDisplay = await productsCollection.find(req.query).toArray();

  return res.render('products', { products: productsToDisplay, admin: admin });
});

router.get('/:id', async (req, res, next) => {
  console.log("Opening product")
  var query = { "_id": req.params.id };
  console.log(req.params.id);
  // return;
  const product = await Product.findOne(query);
  if (!product)
    console.log("CANNOT FIND");

  let admin = false;
  if (req.session.userType == 'admin')
    admin = true;

  res.render('ProductDetails', { prd: product, admin: admin });

});

export default router;