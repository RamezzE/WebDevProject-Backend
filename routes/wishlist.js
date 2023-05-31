import { Router } from 'express';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';
var router = Router();
import User from '../models/user.js';
import Product from '../models/product.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' })

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const database = client.db('web11');
const usersCollection = database.collection('users');
const productsCollection = database.collection('products');
let admin = false;

router.use((req, res, next) => {
  if (req.session.userType !== undefined) {
    if (req.session.userType == 'admin')
      admin = true;
    next();
  }
  else {
    admin=false;
    res.render('err', { err: 'You must login to access this page', admin: admin })
  }
});


router.get('/', async (req, res, next) => {


  const user = await User.findOne({ _id: req.session.userID });
  console.log(user);
  let wishlist = user.wishlist;
  console.log("WISHLIST: " + wishlist)

  let wishlist_obj = [];

  for (let i = 0; i < wishlist.length; i++)
    wishlist_obj.push(new ObjectId(wishlist[i]));
  
  const products = await productsCollection.find({ _id: { $in: wishlist_obj } }).toArray();
  console.log(products);

  let admin = false;
  if (req.session.userType == 'admin')
    admin = true;
  res.render('wishlist', { admin: admin, products: products });

});

router.post('/add', async (req, res, next) => {
  console.log("ADD");

  const { product_id } = req.body;

  const user = await User.findOne({ _id: req.session.userID });
  if(!user.wishlist.includes(product_id)){
  user.wishlist.push(product_id);
  await user.save();
  }
  console.log(user);
  console.log("DONE ADDING");

  res.redirect('/wishlist');
});

router.post('/delete', async (req, res, next) => {
  console.log("DEL");

  const { product_id } = req.body;

  const user = await User.findOne({ _id: req.session.userID });
  let index =  user.wishlist.indexOf(product_id)
  user.wishlist.splice(index,1);

  await user.save();

  console.log(user);
  console.log("DONE Deleting");
  res.redirect('/wishlist');
});

export default router;