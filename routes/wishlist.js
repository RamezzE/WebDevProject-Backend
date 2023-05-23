import { Router } from 'express';
var router = Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  let admin = false;
  if (req.session.userType == 'admin')
    admin = true;
  res.render('wishlist', { admin: admin });
});

export default router;