const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true,
        min:0
    },
    category:{
        type: String,
        lowercase: true,
        enum:['electronics', 'sports', 'cars', 'bikes', 'beauty', 'services']
    },
    //we include the store parameter as an object
    store:{
        type: Schema.Types.ObjectId,
        ref: 'Store'
    }

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
