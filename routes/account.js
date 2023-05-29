import { Router } from 'express';
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

export default router;