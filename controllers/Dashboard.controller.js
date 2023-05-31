import { MongoClient } from "mongodb";
import User from "../models/user.js";
import Product from "../models/product.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import algoliasearch from "algoliasearch";

dotenv.config({ path: "./.env" });

const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const database = client.db("web11");
const usersCollection = database.collection("users");
const productsCollection = database.collection("products");

//-------------------------------------Algolia SEARCH API-------------------------------------
const Algoliaclient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY //PRIVATE ADMIN KEY (DO NOT SHARE) - used to add/update/delete products
);
const productsIndex = Algoliaclient.initIndex("products");
const usersIndex = Algoliaclient.initIndex("users");
// let index = usersIndex;
// index
//   .setSettings({
//     attributesForFaceting: ["filterOnly(tags)"],
//   })
//   .then(() => {
//     // done
//   })
//   .catch((error) => {
//     console.log(error);
//   });

/*
//initialized existing products once into Algolia API
let objectsToIndex = [];
try {
  // Fetch all products from MongoDB
  const users = await usersCollection.find().toArray();

  if (users.length > 0) {
    // Modify objects to use `_id` as objectID
    objectsToIndex = users.map((user) => ({
      objectID: user._id.toString(), // Use `_id` as the objectID
      name: user.firstName + " " + user.lastName,
      email: user.email,
      userType: user.userType,
      createdAt: user.createdAt,
    }));
    index.saveObjects(objectsToIndex);
  } else {
    console.log("No users to add to Algolia index.");
  }
} catch (error) {
  console.error("Error adding users to Algolia:", error);
}
*/

//--------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imageFolderPath = path.join(__dirname, "../public/Images/Products/");
const IMAGE_LIMIT = 3;
let errorMsg = {};

const addProduct = async (req, res) => {
  console.log("Adding product");

  //get data from form
  const {
    productName,
    productPrice,
    productDescription,
    productStock,
    productMen,
    productWomen,
    productKids,
    shoes,
    bags,
  } = req.body;
  if (!req.files || Object.keys(req.files).length === 0)
    return res.status(400).send("No files were uploaded.");
  const images = req.files.images;
  let imagesNo = req.files.images.length;

  let errorMsg = {};

  //validate data
  if (productName.trim() == "")
    errorMsg.productName = "Product name is required";
  else {
    const existingProduct = await Product.findOne({ productName });
    if (existingProduct) {
      errorMsg.productName = "Product already exists!";
    }
  }

  if (productPrice.trim() == "")
    errorMsg.productPrice = "Product price is required";

  if (productDescription.trim() == "")
    errorMsg.productDescription = "Product description is required";

  if (productStock.trim() == "")
    errorMsg.productStock = "Product stock is required";

  if (req.files.images.length == 0)
    errorMsg.image = "Product image is required";
  else if (req.files.images.length > IMAGE_LIMIT)
    errorMsg.image =
      "You can only upload a maximum of " + IMAGE_LIMIT + " images";

  if (Object.keys(errorMsg).length > 0) {
    for (let key in errorMsg) {
      console.log(errorMsg[key]);
    }
    //need to add errorMsg later
    return res.redirect("/dashboard/products?page=0");
  }

  //alternative to above
  if (imagesNo > IMAGE_LIMIT) imagesNo = IMAGE_LIMIT;

  console.log(images);

  let imgNames = [];

  for (let i = 0; i < imagesNo; i++) {
    imgNames[i] = productName + i + ".png";
    console.log(imgNames[i]);
    let uploadPath = __dirname + "/../public/Images/Products/" + imgNames[i];

    images[i].mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);
    });
  }

  let tags = [];

  if (productMen == "on") tags.push("man", "men", "male", "boy", "guy");

  if (productWomen == "on") tags.push("woman", "women", "female", "girl");

  if (productKids == "on") tags.push("kids", "kid", "child", "children");

  if (shoes == "on") tags.push("shoes", "shoe");
  else if (bags == "on") tags.push("bags", "bag");

  //save user to database

  const product = new Product({
    name: productName,
    price: productPrice,
    description: productDescription,
    stock: productStock,
    tags: tags,
    images: imgNames,
  });

  await product.save();
  console.log("Product saved:\n", product);

  await productsIndex.saveObject({
    objectID: product._id.toString(), // Use `_id` as the objectID
    name: product.name,
    price: product.price,
    description: product.description,
    stock: product.stock,
    tags: product.tags,
    images: product.images,
    createdAt: product.createdAt,
  });

  return res.redirect("/dashboard/products?page=0");
};

const ascendingOrder = { price: 1 };

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

const deleteProduct = async (req, res) => {
  const { productID } = req.body;

  const product = await Product.findOne({ _id: productID });

  if (!product) {
    console.log("Product ID not found");
    return res.redirect("/dashboard/products?page=0");
  }

  const images = product.images;
  for (let i = 0; i < images.length; i++) {
    let imagePath = imageFolderPath + images[i];

    // Delete the image file from the file system
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
        return;
      }
    });
  }

  console.log("Deleted product images");

  const deletedProduct = await Product.findOneAndDelete({ _id: productID });

  if (deletedProduct) {
    console.log("Product deleted");
    // Delete the product from the Algolia index (API)
    await productsIndex.deleteObject(productID);
  } else console.log("Error deleting product");

  return res.redirect("/dashboard/products?page=0");
};

const deleteUser = async (req, res) => {
  const { userID } = req.body;
  const deletedUser = await User.findOneAndDelete({ _id: userID });

  if (deletedUser) {
    console.log("User deleted");
    // Delete the user from the Algolia index (API)
    await usersIndex.deleteObject(userID);
  } else console.log("User not found");

  return res.redirect("/dashboard/users?page=0");
};

const makeAdmin = async (req, res) => {
  const { userID } = req.body;
  const user = await User.findOne({ _id: userID });

  user.userType = "admin";
  await user.save();
  // Update the user in the Algolia index (API)
  await usersIndex.saveObject({
    objectID: user._id.toString(), // Use `_id` as the objectID
    name: user.firstName + " " + user.lastName,
    email: user.email,
    userType: user.userType,
    createdAt: user.createdAt,
  });

  return res.redirect("/dashboard/users?page=0");
};

const getProducts = async (req, res, next) => {
  const products = await productsCollection
    .find()
    .sort(ascendingOrder)
    .toArray();
  return res.render("dashboard", {
    products: products,
    currentTab: "products",
    errorMsg: errorMsg,
  });
};

const searchProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  let hitsPerPage = parseInt(req.query.hitsPerPage) || 5;
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

    searchResults = await productsIndex.search("", search_params);
    //sort
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
  } else {
    let error = {};
    return res.render("dashboard", {
      products: searchResults.hits,
      currentTab: "products",
      errorMsg: error,
      page: page,
      hitsPerPage: hitsPerPage,
      totalPages: totalPages,
    });
  }
};

const searchUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  let hitsPerPage = parseInt(req.query.hitsPerPage) || 5;
  let query, searchResults, totalPages;

  try {
    query = req.query.query; // Get the search query from the request query parameters

    // Make Algolia API search request and get the search results

    const search_params = {
      query: query,
      page: page,
      hitsPerPage: hitsPerPage,
    };
    //sort by CreatedAt
    searchResults = await usersIndex.search("", search_params);
    searchResults.hits.sort((a, b) => a.createdAt - b.createdAt); // sort in ascending order of createdAt
    
    //get number of pages
    totalPages = searchResults.nbPages;
  } catch (error) {
    console.error("Error making Algolia API search:", error);
    searchResults = await usersCollection.find().toArray();
    return res.render("dashboard", {
      users: searchResults.hits,
      currentTab: "users",
    });
  }
  if (req.query.ajax) {
    return res.json({
      users: searchResults.hits,
      page: page,
      hitsPerPage: hitsPerPage,
      totalPages: totalPages,
    });
  }

  return res.render("dashboard", {
    users: searchResults.hits,
    currentTab: "users",
    page: page,
    hitsPerPage: hitsPerPage,
    totalPages: totalPages,
  });
};

export default {
  addProduct,
  deleteProduct,
  deleteUser,
  makeAdmin,
  getProducts,
  searchProducts,
  searchUsers,
};
