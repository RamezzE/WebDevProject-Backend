import { MongoClient } from 'mongodb';
import { Router } from 'express';
import User from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' })

var router = Router();

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const database = client.db('web11');
const collection = database.collection('users');

router.get('/', async (req, res, next) => {
  const users = await collection.find().toArray();
  res.render('dashboard', { users });
});

router.post('/users/delete', async (req, res) => {
  const { userID } = req.body;
  console.log(userID);
  const deletedUser = await User.findOneAndDelete({ _id: userID });

  if (deletedUser)
    console.log('User deleted')
  else
    console.log('User not found')

  const users = await collection.find().toArray();
  return res.redirect('/dashboard');
});

export default router;