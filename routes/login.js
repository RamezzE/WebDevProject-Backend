import { Router } from 'express';

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

export default router;