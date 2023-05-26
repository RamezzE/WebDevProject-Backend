import { Router } from 'express';
import User from '../models/user.js';

var router = Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register');
});

router.post('/', async (req, res) => {
  console.log('Registering user');

  //get data from form
  const { firstName, lastName, email, password, confirmPass } = req.body;

  let errorMsg = {};

   //save user to db
   const user = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    userType: 'user'
  });

  await user.save();
  console.log("User saved:", user);
});

export default router;