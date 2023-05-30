import { Router } from 'express';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';
var router = Router();
import User from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' })

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const database = client.db('web11');
const usersCollection = database.collection('users');
const productsCollection = database.collection('products');
let admin = false;

/* GET home page. */
router.get('/', function (req, res, next) {
  const errorMsg = {};

  let admin = false;
  if (req.session.userType == 'admin')
    admin = true;
  
  res.render('checkout', { errorMsg: errorMsg, admin: admin })
});

router.post('/', async (req, res) => {
  console.log('Checkout');

  //get data from form
  const { fullname, email, address, cardnumber } = req.body;

  let errorMsg = {};

  //validate data
  if (fullname.trim() == '')
    errorMsg.fullname = 'Full name is required';
  let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.trim() == '')
    errorMsg.email = 'Email is required';
  else if (!email.match(emailFormat))
    errorMsg.email = 'Invalid email';
  if (address.trim() == '')
    errorMsg.address = 'Address is required';

  let cdform = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  //Starting with 4 length 13 or 16 digits
  if (cardnumber.trim() == '')
    errorMsg.cardnumber = 'cardnumber is required';
  else if (!cardnumber.match(cdform))
    errorMsg.cardnumber = 'Invalid card';

  for (let key in errorMsg) {
    console.log(errorMsg[key]);
  }

  if (Object.keys(errorMsg).length > 0) {
    for (let key in errorMsg) {
      console.log(errorMsg[key]);
    }

    let admin = false;
    if (req.session.userType == 'admin')
      admin = true;
    return res.render('checkout', { errorMsg : errorMsg, admin: admin});
  }
  else{
    console.log("ADD");  
    const user = await User.findOne({ _id: req.session.userID });
    user.orders=user.cart;
    user.cart=[];
      await user.save();
    console.log(user);
    console.log("DONE Ordering");
}
  res.redirect('Myproducts');
});
export default router;