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
  userData.cart = req.session.cart;
  res.render('cart', { admin: admin ,userData });
});
router.get('/:id', async (req, res, next) => {  
  console.log(req.session.cart);
  req.session.cart.push(req.params.id);
  console.log(req.session.cart);
  const userData = {};
  userData.cart = req.session.cart;
    
    let admin = false;
  if (req.session.userType == 'admin')
    admin = true;
  res.render('cart', {  admin: admin,userData });
});
export default router;