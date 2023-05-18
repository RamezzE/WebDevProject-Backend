import { Router } from 'express';
var router = Router();

/* GET home page. */
router.get('/', function (req, res, next) {
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
  if (password.trim() == '')
    errorMsg.password = 'Password is required';
  else if (password.trim().length < 8)
    errorMsg.password = 'Password must be at least 8 characters';

  if (Object.keys(errorMsg).length > 0) {
    for (let key in errorMsg) {
      console.log(errorMsg[key]);
    }
    return res.render('login', { errorMsg });
  }

  //data ok
  res.redirect('account');
});

export default router;