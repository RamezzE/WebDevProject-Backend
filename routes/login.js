import { Router } from 'express';
import User from '../models/user.js';
var router = Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.userType)
    return res.redirect('/');

  let errorMsg = {};
  res.render('login', { errorMsg });
});

router.post('/', async (req, res) => {
  console.log('Logging in user');

  //get data from form
  const { email, password } = req.body;

  let errorMsg = {};

  //validate data
  let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;;
  if (email.trim() == '')
    errorMsg.email = 'Email is required';
  else if (!email.match(emailFormat))
    errorMsg.email = 'Invalid email';
  else {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      errorMsg.email = "Email not found!";
      return res.render('login', { errorMsg });
    }
  }

  if (password.trim() == '')
    errorMsg.password = 'Password is required';
  else {
    const user = await User.findOne({ email: email })
      .then(user => {
        console.log(user);
        if (user.password !== password)
          errorMsg.password = 'Incorrect password';
      })
      .catch(err => {
        console.error(err);
      })

  }

  if (Object.keys(errorMsg).length > 0) {
    for (let key in errorMsg) {
      console.log(errorMsg[key]);
    }
    return res.render('login', { errorMsg });
  }

  //data ok
  const user = await User.findOne({ email: email })
    .then(user => {
      req.session.userType = user.userType;
      req.session.email = user.email;
      req.session.firstName = user.firstName;
      req.session.lastName = user.lastName;

      if (user.userType == "user")
        res.redirect('/account');
      else if (user.userType == "admin")
        res.redirect('/dashboard');
    })
    .catch(err => {
      console.error(err);
    })
});

export default router;