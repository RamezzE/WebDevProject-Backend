import { MongoClient } from 'mongodb';
import { Router } from 'express';
import User from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' })

var router = Router();

const client = new MongoClient("mongodb+srv://donia:donia@customers.qna42wj.mongodb.net/web11?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
const database = client.db('web11');
const collection = database.collection('users');

router.get('/', async (req, res, next) => {
  if (req.session.userType != 'admin')
    return res.redirect('/');

  let currentTab = 'home';
  const users = await collection.find().toArray();
  return res.render('dashboard', { currentTab: currentTab });
});

router.get('/users', async (req, res, next) => {
  if (req.session.userType != 'admin')
    return res.redirect('/');

  let currentTab = 'users';
  const users = await collection.find().toArray();
  return res.render('dashboard', { users: users, currentTab: currentTab });
});

router.post('/users/delete', async (req, res) => {
  const { userID } = req.body;
  const deletedUser = await User.findOneAndDelete({ _id: userID });
  
  if (deletedUser)
    console.log('User deleted')
  else
    console.log('User not found')

  const users = await collection.find().toArray();
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
  return res.render('dashboard', { currentTab: currentTab });
});

export default router;