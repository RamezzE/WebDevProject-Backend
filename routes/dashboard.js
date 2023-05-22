import { MongoClient } from 'mongodb';
import { Router } from 'express';
import User from '../models/user.js';
import Product from '../models/product.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' })

var router = Router();

const client = new MongoClient("mongodb+srv://donia:donia@customers.qna42wj.mongodb.net/web11?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
const database = client.db('web11');
const usersCollection = database.collection('users');
const productsCollection = database.collection('products');

router.get('/', async (req, res, next) => {
  if (req.session.userType != 'admin')
    return res.redirect('/');

  let currentTab = 'home';
  const users = await usersCollection.find().toArray();
  return res.render('dashboard', { currentTab: currentTab });
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
  const products = await productsCollection.find().toArray();
  return res.render('dashboard', { products: products, currentTab: currentTab });
});

router.post('/products/addProduct', async (req, res) => {
	console.log('Adding product');

	//get data from form
	const { productName, productPrice, productDescription, productStock, productMen, productWomen, productKids, shoes, bags, images } = req.body;

  console.log(req.body);

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
	
	if (images.length > 3) {
		errorMsg.images = 'Only 3 images allowed';
	}

	if (errorMsg.length > 0) {
		for (let key in errorMsg) {
			console.log(errorMsg[key]);
		}
		return res.render('products', { errorMsg });
	}

  let men, women, kids;
  men = women = kids = false;
  let type = "";

  console.log(productMen + "\n" + productWomen + "\n" + productKids)

  if (productMen == 'on') 
    men = true; 
  
  if (productWomen == 'on')
    women = true;

  if (productKids == 'on')
    kids = true;

  if (shoes == 'on')
    type = 'shoes';
  
  else if (bags == 'on')
    type = 'bags';

	//save user to db
	const product = new Product({
		name: productName,
		price: productPrice,
		description: productDescription,
		stock: productStock,
		category: [men, women, kids],
		type : type,
		// images
	});

	await product.save();
	console.log("Product saved:", product);

	//data ok
  return res.redirect('/dashboard/products');
});

router.post('/products/delete', async (req, res) => {
  const { productID } = req.body;
  const deletedProduct = await Product.findOneAndDelete({ _id: productID });

  if (deletedProduct)
    console.log('Product deleted')
  else
    console.log('Product not found')

    return res.redirect('/dashboard/products');
});

export default router;