import { Router } from 'express';
var router = Router();

router.use((req, res, next) => {
  if (req.session.userType !== undefined) {
      next();
  }
  else {
    let admin = false;
  if (req.session.userType == 'admin')
    admin = true;
      res.render('err', { err: 'You must login to access this page',admin: admin })
  }
});
/* GET home page. */
router.get('/', function (req, res, next) {
  let admin = false;
  if (req.session.userType == 'admin')
    admin = true;
  res.render('wishlist', { admin: admin });
});

export default router;