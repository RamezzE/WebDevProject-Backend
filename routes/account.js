import { Router } from 'express';
var router = Router();

/* GET Account page. */
router.get('/', function (req, res, next) {
  if (!req.session.userType)
    res.redirect('/login');

  const userData = {};
  
  userData.email = req.session.email;
  userData.userType = req.session.userType;
  userData.firstName = req.session.firstName;
  userData.lastName = req.session.lastName;

  res.render('account', {userData});
});

export default router;