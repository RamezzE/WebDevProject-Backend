var path = require('path')

const express = require('express')
const app = express()

app.set('view engine', 'ejs');

const port = 8080;

app.use(express.static('./public'));

app.get('/', function (req, res) {
    res.render('index', { title: 'Home' });
});

app.listen(port)