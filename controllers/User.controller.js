import User from "../models/user.js";
// import { MongoClient } from 'mongodb';
import { ObjectId } from "mongodb";
import dotenv from "dotenv";
import algoliasearch from "algoliasearch";
import bcrypt from "bcrypt";
dotenv.config({ path: "./.env" });

const Algoliaclient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY //PRIVATE ADMIN KEY (DO NOT SHARE) - used to add/update/delete products
);
const usersIndex = Algoliaclient.initIndex("users");

// const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
// const database = client.db('web11');
// const usersCollection = database.collection('users');
// const productsCollection = database.collection('products');
let admin = false;

const login = async (req, res) => {
  //get data from form
  const { email, password } = req.body;
  let errorMsg = {};

  //validate data
  let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.trim() == "") errorMsg.email = "Email is required";
  else if (!email.match(emailFormat)) errorMsg.email = "Invalid Email";
  else {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      errorMsg.email = "Email not found!";
    }
  }

  let user;
  if (password.trim() == "") errorMsg.password = "Password is required";
  else {
    try {
      user = await User.findOne({ email: email });

      if (!bcrypt.compareSync(password, user.password))
        errorMsg.password = "Incorrect password";
    } catch (err) {
      console.log(err);
    }
  }

  if (Object.keys(errorMsg).length > 0) {
    for (let key in errorMsg) {
      console.log(errorMsg[key]);
    }
    if (req.query.ajax) {
      console.log("Ajax errors");
      return res.json({ errors: errorMsg, admin: false });
    } else {
      console.log("Not ajax errors");
      return res.render("login", { errorMsg: errorMsg, admin: false });
    }
  }
  //data ok
  console.log("DATA OKKK");

  req.session.userID = user._id;
  req.session.userType = user.userType;
  req.session.email = user.email;
  req.session.firstName = user.firstName;
  req.session.lastName = user.lastName;
  req.session.wishlist = user.wishlist;
  req.session.cart = user.cart;

  if (req.query.ajax) {
    console.log("Logged in using ajax");
    if (user.userType == "admin")
      return res.json({ errors: errorMsg, admin: true });
    else return res.json({ errors: errorMsg, admin: false });
  } else {
    console.log("Logged in NOT using ajax");
    if (user.userType == "admin") return res.redirect("/dashboard");
    else return res.redirect("/account");
  }
};

const register = async (req, res) => {
  //get data from form
  const { firstName, lastName, email, password, confirmPass } = req.body;

  let errorMsg = {};

  //validate data
  if (firstName.trim() == "") errorMsg.firstName = "First name is required";

  if (lastName.trim() == "") errorMsg.lastName = "Last name is required";

  let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.trim() == "") errorMsg.email = "Email is required";
  else if (!email.match(emailFormat)) errorMsg.email = "Invalid Email";
  else {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      errorMsg.email = "Email already exists!";
    }
  }

  if (password.trim() == "") errorMsg.password = "Password is required";
  else if (password.trim().length < 8)
    errorMsg.password = "Password must be at least 8 characters";

  if (password.trim() !== confirmPass.trim())
    errorMsg.confirmPass = "Passwords do not match";

  if (Object.keys(errorMsg).length > 0) {
    for (let key in errorMsg) {
      console.log(errorMsg[key]);
    }
    if (req.query.ajax) return res.json({ errors: errorMsg, admin: false });
    else return res.render("register", { errorMsg, admin: false });
  }

  //save user to db
  const user = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: await bcrypt.hash(password, 10),
    userType: "user",
  });

  try {
    await user.save();
    console.log("User saved:", user);
    //save user into algolia
    usersIndex.saveObject({
      objectID: user._id.toString(),
      name: user.firstName + " " + user.lastName,
      email: user.email,
      userType: user.userType,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.log(err);
  }

  //data ok
  //create session
  req.session.userID = user._id;
  req.session.userType = user.userType;
  req.session.firstName = user.firstName;
  req.session.lastName = user.lastName;
  req.session.email = user.email;

  if (req.query.ajax) {
    console.log("Registration done using ajax");
    return res.json({ errors: errorMsg, admin: false });
  } else {
    console.log("Registration done NOT using ajax");
    return res.redirect("/account");
  }
};

const Checkout = async (req, res) => {
  console.log("Checkout");

  //get data from form
  const { fullname, email, address, cardnumber } = req.body;

  let errorMsg = {};

  //validate data
  if (fullname.trim() == "") errorMsg.fullname = "Full name is required";
  let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.trim() == "") errorMsg.email = "Email is required";
  else if (!email.match(emailFormat)) errorMsg.email = "Invalid email";
  if (address.trim() == "") errorMsg.address = "Address is required";

  let cdform = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  //Starting with 4 length 13 or 16 digits
  if (cardnumber.trim() == "") errorMsg.cardnumber = "cardnumber is required";
  else if (!cardnumber.match(cdform)) errorMsg.cardnumber = "Invalid card";

  for (let key in errorMsg)
    console.log(errorMsg[key]);
  

  if (Object.keys(errorMsg).length > 0) {
    for (let key in errorMsg) {
      console.log(errorMsg[key]);
    }
    if (req.query.ajax) {
      console.log("ajax errors");
      return res.json({ errors: errorMsg, admin: false });
    } else {
      console.log("No ajax errors");
      return res.render("checkout", { errorMsg: errorMsg, admin: false });
    }
  } else {
    console.log("ADD");
    const user = await User.findOne({ _id: req.session.userID });
    let cart = user.cart;
    console.log("new Orders: " + cart);
    let orders_obj = user.orders;
    for (let i = 0; i < cart.length; i++)
      orders_obj.push(new ObjectId(cart[i]));

    user.orders = orders_obj;
    user.cart = [];
    await user.save();

    console.log("DONE Ordering");
    if (req.query.ajax) {
      console.log("checkout using ajax");
      return res.json({ errors: errorMsg, admin: false });
    } else {
      console.log("checkout not using ajax");
      return res.redirect("/Myproducts");
    }
  }
};

const editing = async (req, res) => {
  const user = await User.findOne({ _id: req.session.userID });

  console.log("Editing");

  //get data from form
  const { firstName, lastName, email, oldpass, password, confirmPass } =
    req.body;

  let errorMsg = {};

  //validate data

  if (firstName.trim() == "") errorMsg.firstName = "First name is required";

  if (lastName.trim() == "") errorMsg.lastName = "Last name is required";

  let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.trim() == "") errorMsg.email = "Email is required";
  else if (!email.match(emailFormat)) errorMsg.email = "Invalid Email";
  else if (email.trim() !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) errorMsg.email = "Email already exists!";
  }

  if (oldpass.trim() == "") errorMsg.oldpass = "Old password is required";

  if (!bcrypt.compareSync(oldpass, user.password))
    errorMsg.oldpass = "Old password isn't correct";

  if (password.trim() == "") errorMsg.password = "Password is required";
  else if (password.trim().length < 8)
    errorMsg.password = "Password must be at least 8 characters";

  if (password.trim() !== confirmPass.trim())
    errorMsg.confirmPass = "Passwords do not match";

  if (Object.keys(errorMsg).length > 0) {
    for (let key in errorMsg) {
      console.log(errorMsg[key]);
    }
    if (req.query.ajax) return res.json({ errors: errorMsg, admin: false });
    else return res.render("editing", { errorMsg, admin: false });
  }

  //save user to db
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.password = await bcrypt.hash(password, 10);
  await user.save();

  //data ok
  //edit session
  req.session.firstName = user.firstName;
  req.session.lastName = user.lastName;
  req.session.email = user.email;

  //get user from algolia by objectid
  const algoliaUser = await usersIndex.getObject(user._id.toString());
  //update user in algolia
  algoliaUser.name = user.firstName + " " + user.lastName;
  algoliaUser.email = user.email;
  await usersIndex.saveObject(algoliaUser);

  if (req.query.ajax) {
    console.log("Editing done using ajax");
    return res.json({ errors: errorMsg, admin: false });
  } else {
    console.log("Editing done NOT using ajax");
    return res.redirect("/account");
  }
};

export default {
  login,
  register,
  Checkout,
  editing,
};
