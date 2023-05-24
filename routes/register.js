import { Router } from 'express';
import User from '../models/user.js';

var router = Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.userType)
    return res.redirect('/');

  let admin = false;
  if (req.session.userType == 'admin')
    admin = true;

  const errorMsg = {};
  res.render('register', { errorMsg: errorMsg, admin: admin })
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

  if (password.trim() == '')
    errorMsg.password = 'Password is required';
  else if (password.trim().length < 8)
    errorMsg.password = 'Password must be at least 8 characters';

  if (password.trim() !== confirmPass.trim())
    errorMsg.confirmPass = 'Passwords do not match';

  for (let key in errorMsg) {
    console.log(errorMsg[key]);
  }

  if (Object.keys(errorMsg).length > 0) {
    for (let key in errorMsg) {
      console.log(errorMsg[key]);
    }
    return res.render('register', { errorMsg });
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

  //data ok
  //create session
  req.session.userID = user._id;
  req.session.userType = user.userType;
  req.session.firstName = user.firstName;
  req.session.lastName = user.lastName;
  req.session.email = user.email;

  res.redirect('account');
});

export default router;