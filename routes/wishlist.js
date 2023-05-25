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
    const userData = {};
  userData.wishlist = req.session.wishlist;
  res.render('wishlist', { admin: admin ,userData});
});

router.get('/:id', async (req, res, next) => {  
  console.log(req.session.wishlist);
  req.session.wishlist.push(req.params.id);
  console.log(req.session.wishlist);
  const userData = {};
  userData.wishlist = req.session.wishlist;
    
    let admin = false;
  if (req.session.userType == 'admin')
    admin = true;
  res.render('wishlist', {  admin: admin,userData });
});

export default router;