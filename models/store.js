const mongoose = require('mongoose');
const {Schema} = mongoose;

const storeSchema = new Schema({
    name:{
        type: String,
        required:[true, 'Store needs a name!']
    },
    city:{
        type: String,
    },
    email:{
        type: String,
        required:[true, 'Email required please!']
    },
    //we include the product parameter as an object to relate with the product db
    product:{
        type: Schema.Types.ObjectId,
        ref:'Product'
    }
})

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;