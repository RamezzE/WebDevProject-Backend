import User from "../models/user.js";

const checkLoginErrors = async (req, res) => {
  console.log("Logging in user");

  //get data from form
  const { email, password } = req.body;

  let errorMsg = {};

  //validate data
  let emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (email.trim() == "") errorMsg.email = "Email is required";
  else if (!email.match(emailFormat)) errorMsg.email = "Invalid email";
  else {
    const existingUser = await User.findOne({ email: email });
    if (!existingUser) {
      errorMsg.email = "Email not found!";
      return res.json({ errors: errorMsg, admin: false });
    }
  }
  let user;

  if (password.trim() == "") errorMsg.password = "Password is required";
  else {
    try {
      user = await User.findOne({ email: email });
      if (user.password !== password) errorMsg.password = "Incorrect password";
    } catch (err) {
      console.log(err);
    }
  }

  if (Object.keys(errorMsg).length > 0) {
    for (let key in errorMsg) {
      console.log(errorMsg[key]);
    }
    return res.json({ errors: errorMsg, admin: false });
  }
  //data ok

  req.session.userID = user._id;
  req.session.userType = user.userType;
  req.session.email = user.email;
  req.session.firstName = user.firstName;
  req.session.lastName = user.lastName;
  req.session.wishlist = user.wishlist;
  req.session.cart = user.cart;

  let admin;

  if (user.userType == "admin") admin = true;
  else admin = true;

  return res.json({ errors: {}, admin: admin });
};

const login = async (req, res) => {
  console.log("Logging in user not ajax");

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
      return res.render("login", { errorMsg: errorMsg, admin: false });
    }
  }
  
  let user;
  if (password.trim() == "") errorMsg.password = "Password is required";
  else {
    try {
      user = await User.findOne({ email: email });
      if (user.password !== password) errorMsg.password = "Incorrect password";
    } catch (err) {
      console.log(err);
    }
  }

  if (Object.keys(errorMsg).length > 0) {
    for (let key in errorMsg) {
      console.log(errorMsg[key]);
    }
    return res.render("login", { errorMsg: errorMsg, admin: false });
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

  if (user.userType == "admin") res.redirect("/dashboard");
  else res.redirect("/account");
};

const register = async (req, res) => {
  console.log("Registering user");

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

  for (let key in errorMsg) {
    console.log(errorMsg[key]);
  }

  if (Object.keys(errorMsg).length > 0) {
    for (let key in errorMsg) {
      console.log(errorMsg[key]);
    }
    return res.render("register", { errorMsg, admin: false });
  }

  //save user to db
  const user = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    userType: "user",
  });

  await user.save();
  console.log("User saved:", user);

  //data ok
  //create session
  req.session.userID = user._id;
  req.session.userType = user.userType;
  req.session.firstName = user.firstName;
  req.session.lastName = user.lastName;
  req.session.email = user.email;

  res.redirect("account");
};

export default {
  login,
  register,
  checkLoginErrors,
};
