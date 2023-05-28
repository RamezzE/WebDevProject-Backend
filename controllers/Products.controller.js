import { MongoClient } from "mongodb";
import Product from "../models/product.js";
import algoliasearch from "algoliasearch";


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
  "965692c09298a4a99e53d06551605e7f" //public SEARCH ONLY KEY
);
const index = Algoliaclient.initIndex("products");
// --------------------------------------------------------------------------

let admin;
let hitsPerPage;


function checkAdmin(req) {
  if (req.session.userType == "admin") admin = true;
}


//FILTERING DOES NOT SUPPORT PAGING
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

  return res.render("products", { products: products, admin: admin, hitsPerPage: hitsPerPage, page: 0 });
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

  const page = parseInt(req.query.page) || 0;
  hitsPerPage = parseInt(req.query.hitsPerPage) || 5;

  let query;
  let searchResults;

  try {
    query = req.query.query; // Get the search query from the request query parameters

    // Make Algolia API search request and get the search results
    searchResults = await index.search(query, {
      page: page,
      hitsPerPage: hitsPerPage
    });

    searchResults.hits.sort((a, b) => a.price - b.price); // sort in ascending order of price

  } catch (error) {
    console.error("Error making Algolia API search:", error);

    //manual  not very accurate search without api
    searchResults = await productsCollection
      .find({ $text: { $search: query } })
      .sort(ascendingOrder)
      .toArray();
  }
  res.render("products", { products: searchResults.hits, admin: admin, page: page, hitsPerPage: hitsPerPage });
};

export default {
  filterProducts,
  productDetails,
  searchProducts,
};
