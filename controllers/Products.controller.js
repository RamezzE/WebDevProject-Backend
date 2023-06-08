import { MongoClient } from "mongodb";
import Product from "../models/product.js";
import algoliasearch from "algoliasearch";
import mongoose from "mongoose";

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
  else admin = false;
}

function filterProducts(req) {
  let tags = [];

  if (req.query.men == "on") tags.push("man");

  if (req.query.women == "on") tags.push("woman");

  if (req.query.kids == "on") tags.push("kid");

  let type = [];

  if (req.query.shoes == "on") type.push("shoe");

  if (req.query.bags == "on") type.push("bag");

  let tagFilter = `${"(" + tags.map((tag) => `tags:${tag}`).join(" OR ")}`;
  tagFilter += ")";
  let typeFilter = `${"(" + type.map((type) => `tags:${type}`).join(" OR ")}`;
  typeFilter += ")";

  if (tags.length == 0 && type.length == 0) return "";
  if (tags.length == 0) return typeFilter;
  if (type.length == 0) return tagFilter;

  let filters = [tagFilter, typeFilter].filter(Boolean).join(" AND ");
  console.log(filters);

  return filters;
}

const productDetails = async (req, res) => {
  checkAdmin(req);
  console.log("Opening product");
  var query = { _id: req.params.id };
  let product;
  let id = "" + req.params.id + "";
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("Invalid ID");
      res.status(404).render(404, { admin: admin });
    }
  } catch (error) {
    console.log(error);
    res.status(404).render(404, { admin: admin });
  }

  try {
    product = await Product.findOne(query);
  } catch (error) {
    console.log(error);
    res.status(404).render(404, { admin: admin });
  }

  if (!product) {
    console.log("Cannot find product");
    res.status(404).render(404, { admin: admin });
  }

  res.render("ProductDetails", { prd: product, admin: admin });
};

const searchProducts = async (req, res) => {
  checkAdmin(req);

  const page = parseInt(req.query.page) || 0;
  hitsPerPage = parseInt(req.query.hitsPerPage) || 5;
  let query, searchResults, totalPages;

  let filters = filterProducts(req);
  try {
    query = req.query.query; // Get the search query from the request query parameters

    // Make Algolia API search request and get the search results

    const search_params = {
      query: query,
      filters: filters,
      page: page,
      hitsPerPage: hitsPerPage,
    };

    searchResults = await index.search("", search_params);

    //get number of pages
    totalPages = searchResults.nbPages;

    searchResults.hits.sort((a, b) => a.price - b.price); // sort in ascending order of price
  } catch (error) {
    console.error("Error making Algolia API search:", error);

    //manual  not very accurate search without api
    searchResults = await productsCollection
      .find({ $text: { $search: query } })
      .sort(ascendingOrder)
      .toArray();
  }

  if (req.query.ajax) {
    return res.json({
      products: searchResults.hits,
      page: page,
      hitsPerPage: hitsPerPage,
      totalPages: totalPages,
    });
  }
  return res.render("products", {
    products: searchResults.hits,
    admin: admin,
    page: page,
    hitsPerPage: hitsPerPage,
    totalPages: totalPages,
  });
};

export default {
  productDetails,
  searchProducts,
};
