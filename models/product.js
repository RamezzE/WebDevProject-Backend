import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category: [
        {
            type: Boolean,
            length: 3, // 0: men, 1: women, 2: kids
            required: true
        }
    ],
    type: {
        type: String,
        required: true
    },
    images: [
        {
            type: String,
            length: 3,
            required: true
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', productSchema);

export default Product;