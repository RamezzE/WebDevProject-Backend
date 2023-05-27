import { Router } from 'express';
import session from 'express-session';
var router = Router();


router.get('/', function (req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

export default router;