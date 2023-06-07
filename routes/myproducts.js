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
      let orders = user.orders;
      console.log("Orders: " + orders)
    
      let orders_obj = [];
    
      for (let i = 0; i < orders.length; i++)
      orders_obj.push(new ObjectId(orders[i]));
      
      const products = await productsCollection.find({ _id: { $in: orders_obj } }).toArray();
      console.log(products);
    
      let admin = false;
      if (req.session.userType == 'admin')
        admin = true;
      res.render('Myproducts', { admin: admin, products: products });
});

export default router;