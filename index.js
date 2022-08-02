const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');


const Product = require('./models/product');
const Store = require('./models/store');

mongoose.connect('mongodb://localhost:27017/productStore')
    .then(() => {
        console.log('Database started!')
    })
    .catch(err => {
        console.log('Something went wrong!!')
        console.log(err)
    })

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'))

const categories = ['electronics', 'sports', 'cars', 'bikes', 'beauty', 'services'];

//STORE ROUTES

app.get('/stores', async (req, res) => {
    const stores = await Store.find({});
    res.render('stores/index', { stores })
})

app.get('/stores/new', (req,res) => {
    res.render('stores/new');
})

app.get('/stores/:id', async (req, res) => {
    const store = await Store.findById(req.params.id).populate('products');
    res.render('stores/show', { store })
})

app.delete('/stores/:id', async (req,res) => {
    console.log('DELETING!!!');
    const store = await Store.findByIdAndDelete(req.params.id);
    res.redirect('/stores');
})

app.post('/stores', async (req, res) => {
    const store = new Store(req.body);
    await store.save();
    res.redirect('/stores')
})

app.get('/stores/:id/products/new', async (req, res) => {
    const { id } = req.params;
    const store = await Store.findById(id);
    res.render('products/new', { categories, store})
})

app.post('/stores/:id/products', async (req, res) => {
    const { id } = req.params;
    const store = await Store.findById(id);
    const { name, price, category } = req.body;
    const product = new Product({ name, price, category });
    store.products.push(product);
    product.store = store;
    await store.save();
    await product.save();
    res.redirect(`/stores/${id}`)
})

//PRODUCTS ROUTES

app.get('/products', async (req,res) => {
    const {category} = req.query;
    if(category){
        const products = await Product.find({category})
        res.render('products/index', {products,category})

    }else{
        const products = await Product.find({})
        res.render('products/index', {products,category:'All'})

    }
});

app.get('/products/new', (req, res) => {
    res.render('products/new', { categories })
})

app.post('/products', async (req, res) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/${newProduct._id}`)
})

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('store', 'name');
    res.render('products/show', { product })
})

app.get('/products/:id/edit', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    res.render('products/edit', { product, categories })
})

app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    res.redirect(`/products/${product._id}`);
})

app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})

app.listen(3000, () => {
    console.log('Listening in port 3000');
});