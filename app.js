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
app.listen(port)