import { MongoClient } from 'mongodb';
import Product from '../models/product.js';

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const database = client.db('web11');
const productsCollection = database.collection('products');
const ascendingOrder = { price: 1 };

let admin;

function checkAdmin(req) {
    if (req.session.userType == 'admin')
        admin = true;
}

const filterProducts = async (req, res) => {
    checkAdmin(req);
    let tags = [];

    if (req.query.men)
        tags.push('man')

    if (req.query.women)
        tags.push('woman')

    if (req.query.kids)
        tags.push('kids')

    let type = [];

    if (req.query.shoes)
        type.push('shoes')

    if (req.query.bags)
        type.push('bags')

    const query = {
        $and: [
            { tags: { $in: tags } },
            { tags: { $in: type } }
        ]
    };
    const products = await productsCollection.find(query).sort(ascendingOrder).toArray();

    return res.render('products', { products: products, admin: admin });
}

const menProducts = async (req, res) => {
    checkAdmin(req);
    const query = {
        tags: { $in: ['man'] }
    }

    const products = await productsCollection.find(query).sort(ascendingOrder).toArray();
    return res.render('products', { products: products, admin: admin });
}

const womenProducts = async (req, res) => {
    checkAdmin(req);
    const query = {
        tags: { $in: ['woman'] }
    }
    const products = await productsCollection.find(query).sort(ascendingOrder).toArray();
    return res.render('products', { products: products, admin: admin });
}

const kidsProducts = async (req, res) => {
    checkAdmin(req);
    const query = {
        tags: { $in: ['kids'] }
    }
    const products = await productsCollection.find(query).sort(ascendingOrder).toArray();
    return res.render('products', { products: products, admin: admin });
}

const shoesProducts = async (req, res) => {
    const query = {
        tags: { $in: ['shoes'] }
    }
    const products = await productsCollection.find(query).sort(ascendingOrder).toArray();
    return res.render('products', { products: products, admin: admin });
}

const bagsProducts = async (req, res) => {
    checkAdmin(req);
    const query = {
        tags: { $in: ['bags'] }
    }
    const products = await productsCollection.find(query).sort(ascendingOrder).toArray();
    return res.render('products', { products: products, admin: admin });
}

const productDetails = async (req, res) => {
    checkAdmin(req);
    console.log("Opening product")
    var query = { "_id": req.params.id };

    const product = await Product.findOne(query);

    if (!product)
        console.log("Cannot find product");

    res.render('ProductDetails', { prd: product, admin: admin });
}

export default {
    filterProducts,
    menProducts,
    womenProducts,
    kidsProducts,
    shoesProducts,
    bagsProducts,
    productDetails
};