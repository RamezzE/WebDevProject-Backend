import { Router } from 'express';
var router = Router();

let admin;

router.get('/', function (req, res, next) {
  if (req.session.userType == 'admin')
    admin = true;
  else
    admin = false;
  
  res.render('index', { admin: admin });
});

export default router;