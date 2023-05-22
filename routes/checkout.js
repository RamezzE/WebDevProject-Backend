import { Router } from 'express';
var router = Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const errorMsg = {};
  res.render('checkout', { errorMsg })
});

router.post('/', async (req, res) => {
  console.log('Checkout');

  //get data from form
  const {fullname,email,address,cardnumber} = req.body;

  let errorMsg = {};

  //validate data
  if (fullname.trim() == '')
    errorMsg.fullname = 'Full name is required';
  let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.trim() == '')
    errorMsg.email = 'Email is required';
  else if (!email.match(emailFormat))
    errorMsg.email = 'Invalid email';
  if (address.trim() == '')
    errorMsg.address = 'Address is required';
  
  let cdform = /^(?:[0-9]{12}(?:[0-9]{3})?)$/;
  if (cardnumber.trim() == '')
    errorMsg.cardnumber = 'cardnumber is required';
  else if (!cardnumber.match(cdform))
  errorMsg.cardnumber = 'Invalid card';

  for (let key in errorMsg) {
    console.log(errorMsg[key]);
  }

  if (Object.keys(errorMsg).length > 0) {
    for (let key in errorMsg) {
      console.log(errorMsg[key]);
    }
    return res.render('checkout', { errorMsg });
  }
  res.redirect('account');
});
export default router;