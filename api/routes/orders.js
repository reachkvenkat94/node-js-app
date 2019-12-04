const express = require('express');
const router = express.Router();

// Handle incoming GET Request
router.get('/', (req,res,next) => {
    res.status(200).json({
        message:'Orders were fetched'
    })
});

// Handle incoming POST Request
router.post('/', (req,res,next) => {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity
    };
    res.status(201).json({
        message:'Order was created',
        order: order
    })
});

// Handle incoming GET Request with parameter
router.get('/:orderId', (req,res,next) => {
    res.status(201).json({
        message:'Order details',
        orderId: req.params.orderId
    })
});

// Handle incoming DELETE Request
router.delete('/:orderId', (req,res,next) => {
    const orderId = req.params.orderId;
    console.log(orderId);
    res.status(201).json({
        message:'Order deleted: '+orderId,
        orderId: req.params.orderId
    })
});


module.exports = router;