import { Router } from 'express';
import session from 'express-session';
import UserController from '../controllers/User.controller.js'

var router = Router();

let admin = false;

router.use(function (req, res, next) {
  if (!req.session.userType)
    return res.redirect('/login');

  else if (req.session.userType == 'admin')
    admin = true;
  next();
});

router.get('/', function (req, res, next) {

  const userData = {};

  userData.email = req.session.email;
  userData.userType = req.session.userType;
  userData.firstName = req.session.firstName;
  userData.lastName = req.session.lastName;
  
  res.render('account', { userData, admin: admin });
});

router.get('/editing', function (req, res, next) {
  res.render('editing', { errorMsg: {}, admin: admin, user: req.session })
});

router.post('/editing', UserController.editing);

export default router;