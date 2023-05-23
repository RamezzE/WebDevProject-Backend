import { Router } from 'express';
var router = Router();

/* GET Account page. */
let admin = false;

router.get('/', function (req, res, next) {
  if (!req.session.userType)
    res.redirect('/login');

  if (req.session.userType == 'admin')
    admin = true;

  const userData = {};
  
  userData.email = req.session.email;
  userData.userType = req.session.userType;
  userData.firstName = req.session.firstName;
  userData.lastName = req.session.lastName;

  res.render('account', {userData, admin: admin});
});

export default router;