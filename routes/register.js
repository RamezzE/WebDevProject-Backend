import { Router } from 'express';
import User from '../models/user.js';

var router = Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register');
});


export default router;