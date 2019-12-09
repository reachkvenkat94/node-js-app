const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

// Handle incoming GET Request
router.get('/', (req,res,next) => {
    Order.find()
    .select('product quantity _id')
    .populate('product','name')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3001/orders/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// Handle incoming POST Request
router.post('/', (req,res,next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if(!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });
        return order.save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Order stored",
            createdOrder: {
                _id: result._id,
                product: result.product,
                quatity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3001/orders/' + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

// Handle incoming GET Request with parameter
router.get('/:orderId', (req,res,next) => {
    Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
        if(!order){
            return res.status(404).json({
                message: "Order not found"
            });
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: "http://localhost:3001/orders/"
            }
        })
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
});

// Handle incoming DELETE Request
router.delete('/:orderId', (req,res,next) => {
    Order.remove({_id: req.params.orderId })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order Successfully Deleted',
            request: {
                type: 'POST',
                url: "http://localhost:3001/orders/",
                body: {
                    productId: 'ID',
                    quantity: 'number'
                }
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        })
    });
});


module.exports = router;