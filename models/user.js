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

const User = mongoose.model('User', userSchema);

export default User;