import { Router } from 'express';
import UserController from '../controllers/User.controller.js'
var router = Router();

router.use(function (req, res, next) {
  if (req.session.userType)
    return res.redirect('/');
  
  next();
});

router.get('/', function (req, res, next) {
  res.render('login', { errorMsg: {}, admin : false });
});

router.post('/', UserController.login);

export default router;