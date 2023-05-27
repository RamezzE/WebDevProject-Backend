import { Router } from 'express';

var router = Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.userType)
    return res.redirect('/');

  let errorMsg = {};
  res.render('login', { errorMsg });
});


export default router;