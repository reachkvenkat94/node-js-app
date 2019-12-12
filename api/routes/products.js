const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb) {
        cb(null,new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req,file,cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null,true);
    } else {
        cb(null,false);
    }
}

const upload = multer({
    storage: storage, 
    limits: {
    fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


// Handle incoming get Request
router.get('/',(req,res,next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: doc.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3001/products/'+doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

// Handle incoming GET Request with parameters
router.get('/:productId',(req,res,next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select('name price _id productImage')
    .exec() 
    .then(doc => {
        console.log("From Database: "+doc);
        if(doc){
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get details of all products',
                    url: 'http://localhost:3001/products'
                }
            });
        } else {
            res.status(404).json({
                message: "no valid ID found"
            });
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

// Handle incoming PATCH Request
router.patch('/:productId',(req,res,next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id:id}, {$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "Product successfully updated",
            request: {
                type: 'GET',
                url: "http://localhost:3001/products"+id
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); 
});

// Handle incoming DELETE Request
router.delete('/:productId',(req,res,next) => {
    const id = req.params.productId; 
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Produc deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3001/products',
                body: {name: 'String', price: 'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Handle incoming POST Request
router.post('/',upload.single('productImage'),(req,res,next) => {
    console.log(req.file);
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id : result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3001/products/'+result._id
                }
            }
        });
    })
    .catch(err => { 
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
});

module.exports = router;