import { MongoClient } from 'mongodb';
import { Router } from 'express';
import User from '../models/user.js';
import Product from '../models/product.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
dotenv.config({ path: '../.env' })

var router = Router();

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const database = client.db('web11');
const usersCollection = database.collection('users');
const productsCollection = database.collection('products');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageFolderPath = path.join(__dirname, '../public/Images/Products/');
const IMAGE_LIMIT = 3;

var productsToDisplay;
var redirected = false;

router.get('/', async (req, res, next) => {
  if (req.session.userType != 'admin')
    return res.redirect('/');

  let currentTab = 'home';
  
  console.log(req.session.firstName);

  return res.render('dashboard', { currentTab: currentTab, firstName: req.session.firstName });
});

router.get('/users', async (req, res, next) => {
  // if (req.session.userType != 'admin')
  //   return res.redirect('/');

  let currentTab = 'users';
  const users = await usersCollection.find().toArray();
  return res.render('dashboard', { users: users, currentTab: currentTab });
});

router.post('/users/delete', async (req, res) => {
  const { userID } = req.body;
  const deletedUser = await User.findOneAndDelete({ _id: userID });

  if (deletedUser)
    console.log('User deleted')
  else
    console.log('User not found')

  return res.redirect('/dashboard/users');
});

router.post('/users/makeAdmin', async (req, res) => {
  const { userID } = req.body;
  const user = await User.findOne({ _id: userID });

  user.userType = 'admin';
  await user.save();

  return res.redirect('/dashboard/users');

});

router.get('/insights', async (req, res, next) => {
  if (req.session.userType != 'admin')
    return res.redirect('/');

  let currentTab = 'insights';
  return res.render('dashboard', { currentTab: currentTab });
});

router.get('/products', async (req, res, next) => {
  // if (req.session.userType != 'admin')
  //   return res.redirect('/');

  let currentTab = 'products';

  let products;
  if (!redirected) {
    products = await productsCollection.find().toArray();
  }
  else {
    redirected = false;
    products = productsToDisplay;
  }

  return res.render('dashboard', { products: products, currentTab: currentTab });
});

router.post('/products/addProduct', async (req, res) => {
  console.log('Adding product');

  //get data from form
  const { productName, productPrice, productDescription, productStock, productMen, productWomen, productKids, shoes, bags } = req.body;
  const images = req.files.images;
  let imagesNo = req.files.images.length

  let errorMsg = {};

  //validate data
  if (productName.trim() == '')
    errorMsg.productName = 'Product name is required';
  else {
    const existingProduct = await Product.findOne({ productName });
    if (existingProduct) {
      errorMsg.productName = "Product already exists!";
    }
  }

  if (productPrice.trim() == '')
    errorMsg.productPrice = 'Product price is required';

  if (productDescription.trim() == '')
    errorMsg.productDescription = 'Product description is required';

  if (productStock.trim() == '')
    errorMsg.productStock = 'Product stock is required';

  if (req.files.images.length == 0)
    errorMsg.image = 'Product image is required';

  else if (req.files.images.length > IMAGE_LIMIT)
    errorMsg.image = 'You can only upload a maximum of ' + IMAGE_LIMIT + ' images';

  if (Object.keys(errorMsg).length > 0) {
    for (let key in errorMsg) {
      console.log(errorMsg[key]);
    }
    //need to add errorMsg later
    return res.redirect('/dashboard/products');
  }

  //alternative to above
  if (imagesNo > IMAGE_LIMIT)
    imagesNo = IMAGE_LIMIT;

  console.log(images);

  let imgNames = [];

  for (let i = 0; i < imagesNo; i++) {

    imgNames[i] = productName + i + '.png';
    console.log(imgNames[i]);
    let uploadPath = __dirname + '/../public/Images/Products/' + imgNames[i];
    
    images[i].mv(uploadPath, function (err) {
      if (err)
        return res.status(500).send(err);

    });
  }

  let men, women, kids;
  men = women = kids = false;
  let type = "";

  if (productMen == 'on')
    men = true;

  if (productWomen == 'on')
    women = true;

  if (productKids == 'on')
    kids = true;

  if (shoes == 'on')
    type = 'Shoe';

  else if (bags == 'on')
    type = 'Bag';

  //save user to database

  const product = new Product({
    name: productName,
    price: productPrice,
    description: productDescription,
    stock: productStock,
    category: [men, women, kids],
    type: type,
    images: imgNames
  });

  await product.save();
  console.log("Product saved:\n", product);

  //data ok
  return res.redirect('/dashboard/products');
});

router.post('/products/filter', async (req, res) => {
  const { productMen, productWomen, productKids, shoes, bags } = req.body;

  console.log(req.body);

  let men, women, kids;
  men = women = kids = false;
  if (productMen == 'on')
    men = true;
  if (productWomen)
    women = true;
  if (productKids)
    kids = true;

  let type = [];
  if (shoes)
    type.push('Shoe');
  if (bags)
    type.push('Bag');

  const query = {
    category: [men, women, kids],
    type: { $in: type },
  };

  productsToDisplay = await productsCollection.find(query).toArray();
  redirected = true;

  return res.redirect('/dashboard/products');
});

router.post('/products/delete', async (req, res) => {
  const { productID } = req.body;

  const product = await Product.findOne({ _id: productID });

  if (!product) {
    console.log('Product ID not found');
    return res.redirect('/dashboard/products');
  }

  const images = product.images;
  for (let i = 0; i < images.length; i++) {
    let imagePath = imageFolderPath + images[i];

    // Delete the image file from the file system
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error('Error deleting image:', err);
        return;
      }
    });
  }

  console.log("Deleted product images")

  const deletedProduct = await Product.findOneAndDelete({ _id: productID });

  if (deletedProduct)
    console.log('Product deleted')
  else
    console.log('Error deleting product')

  return res.redirect('/dashboard/products');
});

export default router;