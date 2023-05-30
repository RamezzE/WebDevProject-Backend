import { Router } from 'express';
import UserController from '../controllers/User.controller.js'

var router = Router();
let admin = false;

router.use(function (req, res, next) {
  if (req.session.userType)
    return res.redirect('/');
  else if (req.session.userType == 'admin')
    admin = true;
  
  next();
});

router.get('/', function (req, res, next) {
  res.render('register', { errorMsg: {}, admin: admin })
});

router.post('/', UserController.register);

export default router;