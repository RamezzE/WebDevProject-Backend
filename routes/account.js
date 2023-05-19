import { Router } from 'express';
import session from 'express-session';
var router = Router();

/* GET home page. */
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