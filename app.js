const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

// app.use((req,res,next) => {
//     res.status(200).json({
//         message: 'It Works!'
//     });
// });

// Connect to Mongo Atlas Database
mongoose.connect('mongodb+srv://node-shop:node-shop@node-rest-shop-wii10.mongodb.net/test?retryWrites=true&w=majority',
{
    useMongoClient: true   
});

mongoose.Promise = global.Promise;

// morgan is used for logging incoming requests
app.use(morgan('dev'));

// bodyParser is used to get data from body of requests
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// CORS handling - Cross Origin Resource Sharing
app.use((req,res,next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Contol-Allow-Headers', 'Origin,X-Requested-With,Content-Type, Accept, Authorization');
    if (req.method=='OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/uploads',express.static('uploads'));

// Routes which should handle requests
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);

app.use((req,res,next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});


module.exports = app;

