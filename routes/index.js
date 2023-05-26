import { Router } from 'express';
var router = Router();

let admin = false;

router.get('/', function (req, res, next) {
  if (req.session.userType == 'admin')
    admin = true;
  
  res.render('index', { admin: admin });
});

export default router;