import { MongoClient } from 'mongodb';
import { Router } from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' })

var router = Router();

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const database = client.db('web11');
const collection = database.collection('users');
const users = await collection.find().toArray();

router.get('/', function (req, res, next) {
  res.render('dashboard', { users });
});

router.post('/', async (req, res) => {
    
});

export default router;