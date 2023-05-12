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
app.get('/dashboard', function (req, res) {
    res.render('dashboard', { title: 'Home' });
});
app.get('/men', function (req, res) {
    res.render('men_products', { title: 'Home' });
});
app.get('/women', function (req, res) {
    res.render('women_products', { title: 'Home' });
});
app.get('/shoes', function (req, res) {
    res.render('shoes_products', { title: 'Home' });
});
app.get('/ProductDetails', function (req, res) {
    res.render('ProductDetails', { title: 'Home' });
});
app.use(function (req, res) {
    res.status(404).render('404', { title: 'Home' });
});
app.listen(port)