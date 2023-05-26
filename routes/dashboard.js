import { MongoClient } from 'mongodb';
import { Router } from 'express';
import User from '../models/user.js';
import Product from '../models/product.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
dotenv.config({ path: './.env' })

var router = Router();

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const database = client.db('web11');
const usersCollection = database.collection('users');
const productsCollection = database.collection('products');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageFolderPath = path.join(__dirname, '../public/Images/Products/');
const IMAGE_LIMIT = 3;

router.use((req, res, next) => {
  if (req.session.userType != 'admin')
    res.redirect('/');
  else
    next();
});

router.get('/', async (req, res, next) => {
  if (req.session.userType != 'admin')
    return res.redirect('/');

  let currentTab = 'home';

  console.log(req.session.firstName);

  return res.render('dashboard', { currentTab: currentTab, firstName: req.session.firstName });
});

router.get('/users', async (req, res, next) => {

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

  let products = await productsCollection.find().toArray();
  return res.render('dashboard', { products: products, currentTab: 'products' });
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

  let tags = [];

  if (productMen == 'on')
    tags.push('man', 'men', 'male', 'boy', 'guy');

  if (productWomen == 'on')
    tags.push('woman', 'women', 'female', 'girl');

  if (productKids == 'on')
    tags.push('kids', 'kid', 'child', 'children')

  if (shoes == 'on')
    tags.push('shoes', 'shoe');

  else if (bags == 'on')
    tags.push('bags', 'bag');

  //save user to database

  const product = new Product({
    name: productName,
    price: productPrice,
    description: productDescription,
    stock: productStock,
    tags: tags,
    images: imgNames
  });

  await product.save();
  console.log("Product saved:\n", product);

  //data ok
  return res.redirect('/dashboard/products');
});

router.get('/products/filter', async (req, res) => {

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

  return res.render('dashboard', { products: productsToDisplay, currentTab: 'products' });
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