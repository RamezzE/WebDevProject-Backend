import { Router } from 'express';
var router = Router();
import UserController from '../controllers/User.controller.js'

/* GET home page. */
router.get('/', function (req, res, next) {
  const errorMsg = {};

  let admin = false;
  if (req.session.userType == 'admin')
    admin = true;
  
  res.render('checkout', { errorMsg: errorMsg, admin: admin })
});

router.post('/', UserController.Checkout);

export default router;