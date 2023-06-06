import { Router } from 'express';
import UserController from '../controllers/User.controller.js'

var router = Router();
let admin = false;

router.use((req, res, next) => {
    if (req.session.userType !== undefined) {
      if (req.session.userType == 'admin')
      admin = true;
        next();
    }
    else {
      admin = false;
      res.render('err', { err: 'You must login to access this page',admin: admin })
    }
  });

router.get('/', function (req, res, next) {
  res.render('editing', { errorMsg: {}, admin: admin })
});

router.post('/', UserController.editing);

export default router;