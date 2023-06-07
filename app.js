import HttpError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import session from 'express-session';
import fileUpload from 'express-fileupload';

import index_router from "./routes/index.js";
import account_router from "./routes/account.js";
import login_router from "./routes/login.js";
import cart_router from "./routes/cart.js";
import wishlist_router from "./routes/wishlist.js";
import dashboard_router from "./routes/dashboard.js";
import register_router from "./routes/register.js";
import product_router from "./routes/products.js";
import check_router from "./routes/checkout.js";
import signOut_router from "./routes/signOut.js";
import Myorders_router from "./routes/myproducts.js";

//Read the current directory name
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
console.log(`Project Root dir : ${__dirname}`);

const app = express();
app.use(session({
  secret: 'secret-key',
  resave: true,
  saveUninitialized: true
}));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());

//When extended property is set to true, the URL-encoded data will be parsed with the qs library.
//qs library allows you to create a nested object from your query string.

// When extended property is set to false, the URL-encoded data will instead be parsed with the query-string library.
// query-string library does not support creating a nested object from your query string.

app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
//setup cookie parser middleware
app.use(cookieParser());
//setup static folder for serving static files in Express
app.use(express.static(path.join(__dirname, 'public')));

//setup routes
app.use('/', index_router);
app.use('/account', account_router);
app.use('/wishlist', wishlist_router);
app.use('/cart', cart_router);
app.use('/login', login_router);
app.use('/dashboard', dashboard_router);
app.use('/register', register_router);
app.use('/products',product_router);
app.use('/checkout', check_router);
app.use('/signOut', signOut_router);
app.use('/Myproducts', Myorders_router);


// error handler
app.use((req, res, err) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    
    // render the error page
    // res.status(err.status || 500);
    let admin = false;
    if (req.session.admin == "admin")
      admin = true;
    res.status('404').render('404', {admin: admin});
  });
console.log("ENV: ", app.get('env'));
export default app;