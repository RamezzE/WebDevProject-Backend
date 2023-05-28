import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    stock: {
        type: Number,
        required: true,
        trim: true
    },
    tags: [
        {
            type: String,
            required: true
        }
    ],
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

productSchema.index({'$**': 'text'});
const Product = mongoose.model('Product', productSchema);

export default Product;