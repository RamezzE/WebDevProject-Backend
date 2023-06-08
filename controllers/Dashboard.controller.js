import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import User from "../models/user.js";
import Product from "../models/product.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import algoliasearch from "algoliasearch";

import ProductController from "../controllers/Products.controller.js";
import { error } from "console";

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

// await usersIndex.clearObjects();

// let index = usersIndex;
// //initialized existing products once into Algolia API
// let objectsToIndex = [];
// try {
//   // Fetch all products from MongoDB
//   const users = await usersCollection.find().toArray();

//   if (users.length > 0) {
//     // Modify objects to use `_id` as objectID
//     objectsToIndex = users.map((user) => ({
//       objectID: user._id.toString(), // Use `_id` as the objectID
//       name: user.firstName + " " + user.lastName,
//       email: user.email,
//       userType: user.userType,
//       createdAt: user.createdAt,
//     }));
//     index.saveObjects(objectsToIndex);
//   } else {
//     console.log("No users to add to Algolia index.");
//   }
// } catch (error) {
//   console.error("Error adding users to Algolia:", error);
// }

// let index = productsIndex;

// try {
//   // Fetch all products from MongoDB
//   const products = await productsCollection.find().toArray();

//   if (products.length > 0) {
//     // Modify objects to use `_id` as objectID
//     objectsToIndex = products.map((product) => ({
//       objectID: product._id.toString(), // Use `_id` as the objectID
//       name: product.name,
//       price: product.price,
//       description: product.description,
//       stock: product.stock,
//       tags: product.tags,
//       images: product.images,
//       createdAt: product.createdAt,
//     }));
//     index.saveObjects(objectsToIndex);
//   } else {
//     console.log("No products to add to Algolia index.");
//   }
// } catch (error) {
//   console.error("Error adding products to Algolia:", error);
// }

// console.log("Algolia index updated.");

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
  console.log(req.body);

  // let errorMsg = {
  //   productName: "",
  //   productPrice: "",
  //   productDescription: "",
  //   productStock: "",
  //   images: "",
  // };

  let errorMsg = {};

  //validate data
  if (productName.trim() == "") {
    errorMsg.productName = "Product name is required";
    console.log("Name error");
  } else {
    const existingProduct = await Product.findOne({ name: productName });
    if (existingProduct) errorMsg.productName = "Product already exists!";
  }

  if (productPrice.trim() == "")
    errorMsg.productPrice = "Product price is required";
  else if (isNaN(productPrice))
    errorMsg.productPrice = "Product price must be a number";
  else if (productPrice < 0)
    errorMsg.productPrice = "Product price cannot be negative";

  if (productDescription.trim() == "")
    errorMsg.productDescription = "Product description is required";

  if (!productMen && !productWomen && !productKids) {
    errorMsg.targetAudience = "Please select at least one target audience";
  }

  if (!shoes && !bags) {
    errorMsg.productType = "Please select at least one product type";
  }

  if (productStock.trim() == "")
    errorMsg.productStock = "Product stock is required";
  else if (isNaN(productStock))
    errorMsg.productStock = "Product stock must be a number";
  else if (productStock < 0)
    errorMsg.productStock = "Product stock cannot be negative";

  let imgNames = [];

  if (!req.files || Object.keys(req.files).length === 0) {
    errorMsg.images = "Product image is required";
    console.log("No files");
  } else if (req.files.images.length != IMAGE_LIMIT) {
    errorMsg.images = "Please upload exactly " + IMAGE_LIMIT + " images";
    console.log("Wrong number of files");
    console.log(req.files.images.length);
  }

  if (Object.keys(errorMsg).length > 0) {
    for (let key in errorMsg) console.log(errorMsg[key]);

    //need to add errorMsg without ajax later
    if (req.query.ajax) return res.json({ errorMsg });
    else return res.redirect("/dashboard/products?page=0");
  }

  let images = req.files.images;

  for (let i = 0; i < req.files.images.length; i++) {
    imgNames[i] = productName.trim() + i + ".png";
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

  console.log("Product saved to Algolia and MongoDB");

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

const checkProductID = async (req, res) => {
  const { productID } = req.body;
  errorMsg = { productID: "" };
  let fetchedFields = {
    productName: "",
    productPrice: "",
    productDescription: "",
    productStock: "",
    tags: [],
  };

  try {
    if (!productID || !mongoose.Types.ObjectId.isValid(productID)) {
      // Handle invalid productID (e.g., return an error response)
      errorMsg.productID = "Invalid productID";
      return res.status(400).json({ errorMsg });
    }

    const product = await Product.findOne({ _id: productID });
    if (!product) {
      console.log("Product ID not found");
      errorMsg.productID = "Product ID not found";
      if (req.query.ajax) return res.json({ errorMsg });
      return res.redirect("/dashboard/products?page=0");
    }
    fetchedFields.productName = product.name;
    fetchedFields.productPrice = product.price;
    fetchedFields.productDescription = product.description;
    fetchedFields.productStock = product.stock;
    fetchedFields.tags = product.tags;

    console.log(fetchedFields);
    return res.json({ fetchedFields });
  } catch (error) {
    errorMsg.productID = "Product ID not found";
    console.error("Error editing product:", error);
    if (req.query.ajax) return res.json({ errorMsg });
    return res.redirect("/dashboard/products?page=0");
  }
};

const editProduct = async (req, res) => {
  const {
    productID,
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
  errorMsg = {};

  console.log(req.body);

  if (productName.trim() == "") {
    errorMsg.productName = "Product name is required";
    console.log("Name error");
  } else {
    const existingProduct = await Product.findOne({ productName });
    if (existingProduct) {
      errorMsg.productName = "Product already exists!";
    }
  }

  if (productPrice.trim() == "")
    errorMsg.productPrice = "Product price is required";
  else if (isNaN(productPrice))
    errorMsg.productPrice = "Product price must be a number";
  else if (productPrice < 0)
    errorMsg.productPrice = "Product price cannot be negative";

  if (productDescription.trim() == "")
    errorMsg.productDescription = "Product description is required";

  if (!productMen && !productWomen && !productKids) {
    errorMsg.targetAudience = "Please select at least one target audience";
  }

  if (!shoes && !bags) {
    errorMsg.productType = "Please select at least one product type";
  }

  if (productStock.trim() == "")
    errorMsg.productStock = "Product stock is required";
  else if (isNaN(productStock))
    errorMsg.productStock = "Product stock must be a number";
  else if (productStock < 0)
    errorMsg.productStock = "Product stock cannot be negative";

  // try {
  if (req.files) {
    console.log("Images detected");
    if (req.files.images.length != IMAGE_LIMIT)
      errorMsg.images =
        "Please upload either NO Images or exactly " + IMAGE_LIMIT + " images ";
  } else {
    console.log("No images uploaded or error detecting them");
  }
  // } catch (error) {
  // console.log(error)
  // console.log("No images uploaded or error detecting them");
  // }

  if (Object.keys(errorMsg).length > 0) {
    if (req.query.ajax) {
      console.log("Returning error in json using ajax");
      return res.json({ errorMsg });
    } else {
      return res.redirect("/dashboard/products?page=0");
    }
  }
  // return res.render("products", { errorMsg: errorMsg, admin: true });

  let tags = [];

  if (productMen == "on") tags.push("man", "men", "male", "boy", "guy");

  if (productWomen == "on") tags.push("woman", "women", "female", "girl");

  if (productKids == "on") tags.push("kids", "kid", "child", "children");

  if (shoes == "on") tags.push("shoes", "shoe");
  else if (bags == "on") tags.push("bags", "bag");

  const product = await Product.findOne({ _id: productID });

  console.log(productID);
  if (!product) {
    if (req.query.ajax) return res.json({ error: "Product ID not found" });
    return res.redirect("/dashboard/products?page=0");
  }
  let images;
  images = product.images;
  if (productName != product.name) {
    //rename images
    for (let i = 0; i < images.length; i++) {
      let oldPath = path.join(
        __dirname,
        "../public/Images/Products/",
        images[i]
      );

      let newPath = path.join(
        __dirname,
        "../public/Images/Products/",
        productName.trim() + i + ".png"
      );

      fs.rename(oldPath, newPath, (err) => {
        if (err) console.log(err);
      });
      images[i] = productName.trim() + i + ".png";
    }
  }

  product.name = productName;
  product.price = productPrice;
  product.description = productDescription;
  product.stock = productStock;
  if (tags.length > 0) product.tags = tags;
  product.images = images;

  await product.save();

  //update in algolia here
  //get the product from the algolia
  const algoliaProduct = await productsIndex.getObject(productID);
  //update the product
  algoliaProduct.name = productName;
  algoliaProduct.price = productPrice;
  algoliaProduct.description = productDescription;
  algoliaProduct.stock = productStock;
  if (tags.length > 0) algoliaProduct.tags = tags;
  algoliaProduct.images = images;
  //save the product
  await productsIndex.saveObject(algoliaProduct);

  console.log("Product edited sucessfully:\n", product);

  let successMsg = "Product edited sucessfully";

  res.json({ successMsg });
};

const deleteProduct = async (req, res) => {
  const { productID } = req.body;
  let product;
  try {
    product = await Product.findOne({ _id: productID });
  } catch (error) {
    console.error("Error deleting product:", error);
    if (req.query.ajax) return res.json({ error: "Product ID not found" });
    return res.redirect("/dashboard/products?page=0");
  }

  if (!product) {
    console.log("Product ID not found");
    if (req.query.ajax) return res.json({ error: "Product ID not found" });
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
    console.log("Product deleted in mongo");
    // Delete the product from the Algolia index (API)
    await productsIndex.deleteObject(productID);
  } else {
    console.log("Error deleting product");
    if (req.query.ajax) return res.json({ error: "Error deleting product" });
    return res.redirect("/dashboard/products?page=0");
  }

  if (req.query.ajax) return res.json({ msg: "Product deleted successfully" });
  return res.redirect("/dashboard/products?page=0");
};

const deleteUser = async (req, res) => {
  const { userID } = req.body;
  try {
    const user = await User.findOne({ _id: userID });
    console.log(userID);

    if (!user) {
      console.log("User not found");
      if (req.query.ajax) return res.json({ error: "User not found" });

      return res.redirect("/dashboard/users?page=0");
    }

    const deletedUser = await User.findOneAndDelete({ _id: userID });

    if (deletedUser) {
      console.log("User deleted in mongo");
      let bool = await usersIndex.deleteObject(userID);
      if (bool) console.log("User deleted in algolia");
      else console.log("Error deleting user in algolia");
    } else {
      console.log("Error deleting user");
      if (req.query.ajax) return res.json({ error: "Error deleting user" });

      return res.redirect("/dashboard/users?page=0");
    }
  } catch (err) {
    console.log(err);
    console.log("Error deleting user");
    if (req.query.ajax) return res.json({ error: "Error deleting user" });

    return res.redirect("/dashboard/users?page=0");
  }

  if (req.query.ajax) return res.json({ msg: "User deleted successfully" });

  return res.redirect("/dashboard/users?page=0");
};

const makeAdmin = async (req, res) => {
  const { userID } = req.body;
  let user;
  try {
    user = await User.findOne({ _id: userID });
    if (!user) {
      console.log("User not found");
      if (req.query.ajax) return res.json({ error: "User not found" });

      return res.redirect("/dashboard/users?page=0");
    }
  } catch (err) {
    console.log(err);
    console.log("User not found");
    if (req.query.ajax) return res.json({ error: "User not found" });

    return res.redirect("/dashboard/users?page=0");
  }

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

  if (req.query.ajax) return res.json({ msg: "User updated successfully" });

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
  let query = req.query.query || "";
  let searchResults, totalPages;

  let filters = filterProducts(req);
  try {
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
  let query = req.query.query || "";
  let searchResults, totalPages;

  try {
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
  checkProductID,
  editProduct,
  deleteProduct,
  deleteUser,
  makeAdmin,
  getProducts,
  searchProducts,
  searchUsers,
};
