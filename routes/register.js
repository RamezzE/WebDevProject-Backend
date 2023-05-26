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

   //validate data
   if (firstName.trim() == '')
   errorMsg.firstName = 'First name is required';

 if (lastName.trim() == '')
   errorMsg.lastName = 'Last name is required';

 let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
 if (email.trim() == '')
   errorMsg.email = 'Email is required';
 else if (!email.match(emailFormat))
   errorMsg.email = 'Invalid email';
 else {
   const existingUser = await User.findOne({ email });
   if (existingUser) {
     errorMsg.email = "Email already exists!";
   }
 }

 

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