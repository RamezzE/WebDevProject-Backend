import { Router } from 'express';
import { MongoClient } from 'mongodb';
var router = Router();
import Product from '../models/product.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' })

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const database = client.db('web11');
const productsCollection = database.collection('products');

router.use((req, res, next) => {
  if (req.session.userType !== undefined) {
      next();
  }
  else {
    let admin = false;
  if (req.session.userType == 'admin')
    admin = true;
      res.render('err', { err: 'You must login to access this page',admin: admin })
  }
});
/* GET home page. */
router.get('/', async (req, res, next)=> {
  console.log(req.session.wishlist);
  let admin = false;
  if (req.session.userType == 'admin')
    admin = true;
    let done=false;
  req.session.wishlist.forEach(element => {
  Product.find({ '_id': element})
  .then(async products => {
    console.log(products);
    if(element===(req.session.wishlist[req.session.wishlist.size-1])){done=true;}
    if(done){res.render('wishlist', { products: products, admin: admin });}})
});
 
});

router.get('/:id', async (req, res, next) => {  
  console.log(req.session.wishlist);
  req.session.wishlist.push(req.params.id);
  console.log(req.session.wishlist);
  let products =[];
  req.session.wishlist.forEach(element => {
    products.push(Product.findById(element));
  });
    let admin = false;
  if (req.session.userType == 'admin')
    admin = true;
  res.render('wishlist', {  admin: admin,products: products });
});

export default router;