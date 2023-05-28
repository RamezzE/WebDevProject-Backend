import { MongoClient } from "mongodb";
import Product from "../models/product.js";
import algoliasearch from 'algoliasearch'

const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const database = client.db("web11");
const productsCollection = database.collection("products");
const ascendingOrder = { price: 1 };

//-------------------------------------Algolia SEARCH API-------------------------------------
const Algoliaclient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  '965692c09298a4a99e53d06551605e7f', //public SEARCH ONLY KEY
  );
const index = Algoliaclient.initIndex("products");
// --------------------------------------------------------------------------

let admin;

function checkAdmin(req) {
  if (req.session.userType == "admin") admin = true;
}

const filterProducts = async (req, res) => {
  checkAdmin(req);
  let tags = [];

  if (req.query.men) tags.push("man");

  if (req.query.women) tags.push("woman");

  if (req.query.kids) tags.push("kids");

  let type = [];

  if (req.query.shoes) type.push("shoes");

  if (req.query.bags) type.push("bags");

  const query = {
    $and: [{ tags: { $in: tags } }, { tags: { $in: type } }],
  };
  const products = await productsCollection
    .find(query)
    .sort(ascendingOrder)
    .toArray();

  return res.render("products", { products: products, admin: admin });
};

const menProducts = async (req, res) => {
  checkAdmin(req);
  // const query = {
  //     tags: { $in: ['man'] }
  // }
  // const products = await productsCollection.find(query).sort(ascendingOrder).toArray();

  const products = await productsCollection
    .find({ $text: { $search: "man" } })
    .sort(ascendingOrder)
    .toArray();
  return res.render("products", { products: products, admin: admin });
};

const womenProducts = async (req, res) => {
  checkAdmin(req);
  //   const query = {
  //     tags: { $in: ["woman"] },
  //   };
  const products = await productsCollection
    .find({ $text: { $search: "woman" } })
    .sort(ascendingOrder)
    .toArray();
  return res.render("products", { products: products, admin: admin });
};

const kidsProducts = async (req, res) => {
  checkAdmin(req);
  const query = {
    tags: { $in: ["kids"] },
  };
  const products = await productsCollection
    .find({ $text: { $search: "kid" } })
    .sort(ascendingOrder)
    .toArray();
  return res.render("products", { products: products, admin: admin });
};

const shoesProducts = async (req, res) => {
  const query = {
    tags: { $in: ["shoes"] },
  };
  const products = await productsCollection
    .find({ $text: { $search: "shoe" } })
    .sort(ascendingOrder)
    .toArray();
  return res.render("products", { products: products, admin: admin });
};

const bagsProducts = async (req, res) => {
  checkAdmin(req);
  const query = {
    tags: { $in: ["bags"] },
  };
  const products = await productsCollection
    .find({ $text: { $search: "bag" } })
    .sort(ascendingOrder)
    .toArray();
  return res.render("products", { products: products, admin: admin });
};

const productDetails = async (req, res) => {
  checkAdmin(req);
  console.log("Opening product");
  var query = { _id: req.params.id };

  const product = await Product.findOne(query);

  if (!product) console.log("Cannot find product");

  res.render("ProductDetails", { prd: product, admin: admin });
};

const searchProducts = async (req, res) => {
  
  checkAdmin(req);
  let query;
  let searchResults;
  try {
    query = req.query.search;// Get the search query from the request query parameters
    
    // Make Algolia API search request and get the search results
    searchResults = await index.search(query);
    searchResults.hits.sort((a, b) => a.price - b.price); // sort in ascending order of price

    return res.render("products", { products: searchResults.hits, admin:admin });

  } catch (error) {
    console.error("Error making Algolia API search:", error);
    //manual  not very accurate search without api
    searchResults = await productsCollection.find({ $text: { $search: query } }).sort(ascendingOrder).toArray();
  }
  res.render("products", { products: searchResults, admin: admin });
};

export default {
  filterProducts,
  menProducts,
  womenProducts,
  kidsProducts,
  shoesProducts,
  bagsProducts,
  productDetails,
  searchProducts,
};
