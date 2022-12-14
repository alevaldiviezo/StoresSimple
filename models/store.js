const mongoose = require('mongoose');
const Product = require('./product');
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
    products:[
        {
            type: Schema.Types.ObjectId,
            ref:'Product'
        }
    ]
})

//DELETE code for removing store and products
storeSchema.post('findOneAndDelete', async function(store){
    if(store.products.length){
        const res = await Product.deleteMany({_id: {$in: store.products} })
        console.log(res);
    }
})

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;