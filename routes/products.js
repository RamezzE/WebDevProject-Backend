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

  const query = {
    tags: {$in : ['man']}
  }
  const products = await productsCollection.find(query).toArray();
  return res.render('products', { products: products, admin: admin });
});

router.get('/women', async (req, res, next) => {

  const query = {
    tags: {$in : ['woman']}
  }
  const products = await productsCollection.find(query).toArray();
  return res.render('products', { products: products, admin: admin });
});

router.get('/kids', async (req, res, next) => {

  const query = {
    tags: {$in : ['kids']}
  }
  const products = await productsCollection.find(query).toArray();
  return res.render('products', { products: products, admin: admin });
});

router.get('/shoes', async (req, res, next) => {
  const query = {
    tags: {$in : ['shoes']}
  }
  const products = await productsCollection.find(query).toArray();
  return res.render('products', { products: products, admin: admin });
});

router.get('/bags', async (req, res, next) => {
  const query = {
    tags: {$in : ['bags']}
  }
  const products = await productsCollection.find(query).toArray();
  return res.render('products', { products: products, admin: admin });
});

router.get('/filter', async (req, res, next) => {
  let tags = [];

  if (req.query.men)
    tags.push('man')

  if (req.query.women)
    tags.push('woman')

  if (req.query.kids)
    tags.push('kids')

  let type = [];

  if (req.query.shoes)
    type.push('shoes')

  if (req.query.bags)
    type.push('bags')

  const query = {
    $and: [
      { tags: { $in: tags } },
      { tags: { $in: type } }
    ]
  };

  let productsToDisplay = await productsCollection.find(query).toArray();

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