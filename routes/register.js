import { Router } from 'express';
import User from '../models/user.js';

var router = Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const errorMsg = {};
  res.render('register', { errorMsg })
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

  if (password.trim() == '')
    errorMsg.password = 'Password is required';
  else if (password.trim().length < 8)
    errorMsg.password = 'Password must be at least 8 characters';
  
  if (password.trim() !== confirmPass.trim())
    errorMsg.confirmPass = 'Passwords do not match';

  if (Object.keys(errorMsg).length > 0) {
    for (let key in errorMsg) {
      console.log(errorMsg[key]);
    }
    return res.render('register', { errorMsg });
  }


  //data ok
  res.redirect('/');

  console.log("Tamam for now");

});

export default router;