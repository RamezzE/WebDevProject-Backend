var path = require('path')

const express = require('express')
const app = express()

app.set('view engine', 'ejs');

const port = 8080;

app.use(express.static('./public'));

app.get('/', function (req, res) {
    res.render('index', { title: 'Home' });
});
app.get('/wishlist', function (req, res) {
    res.render('wishlist', { title: 'Home' });
});
app.get('/cart', function (req, res) {
    res.render('cart', { title: 'Home' });
});
app.get('/checkout', function (req, res) {
    res.render('checkout', { title: 'Home' });
});
app.get('/login', function (req, res) {
    res.render('login', { title: 'Home' });
});
app.get('/register', function (req, res) {
    res.render('register', { title: 'Home' });
});
app.get('/account', function (req, res) {
    res.render('account', { title: 'Home' });
});
app.listen(port)