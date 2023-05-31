import mongoose from 'mongoose';
import bcrypt from'bcrypt';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  wishlist: [
    {
        type: String
    }
],cart: [
  {
      type: String
  }
],orders: [
  {
      type: String
  }
]
});
userSchema.pre('save', async function (next) {
  try {
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(this.password, salt);
  this.password = hashedpassword;
  next();
  } catch (error) {
  next(error);
  }
  });
  
  
  userSchema.methods.isValidPassword = async function (password) {
  try {
  return await bcrypt.compare(password, this.password);
  } catch (error) {
  throw error;
  }
  };

const User = mongoose.model('User', userSchema);

export default User;