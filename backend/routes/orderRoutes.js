import express from 'express'
import Order from '../models/orderModel.js';
import expressAsyncHandler from 'express-async-handler';
import {isAuth} from '../utils.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const orderRouter = express.Router();


orderRouter.post('/',isAuth, expressAsyncHandler(async (req, res) => {
    
    const newOrder = new Order({
        orderItems: req.body.orderItems.map((x) => ({...x, product: x._id})),
        shippingAddress: req.body.shippingAddress,
        paymentMethod:req.body.paymentMethod,
        itemsPrice:req.body.itemsPrice,
        shippingPrice:req.body.shippingPrice,
        taxPrice:req.body.taxPrice,
        totalPrice:req.body.totalPrice,
        user: req.user._id,
    });
    try{
        const instance = new Razorpay({
            key_id:process.env.RAZORPAY_ID,
            key_secret:process.env.RAZORPAY_SECRET,
        });
        const options = {
            amount: req.body.totalPrice,
            currency: "USD",
            reciept: crypto.randomBytes(10).toString('hex'),
        };

        instance.orders.create(options, (error, order) => {
            if(error) {
                console.log(error);
                return res.status(500).json({message: "Something went wrong!"});
            }
        });
        const order = await newOrder.save();
        res.status(201).send({message: 'New order Created', order});

    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal Server Error'});
    }

})
);
orderRouter.post('/verify', async (req,res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature } = req.body;
            const sign = razorpay_order_id+"|"+razorpay_payment_id;
            const expectedSign = crypto
            .createHmac("sha256", product.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex");

            if(razorpay_signature === expectedSign){
                return res.status(200).json ({message: "Payment verified!"});
            } else {
                return res.status(400).json ({message: "Invalid Signature!"});
            }
        }
        catch(error) {
            console.log(error);
            res.status(500).json({message: "internal server error!"});
        }
    }
);
orderRouter.get('/:id',isAuth, expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        res.send(order);
    } else {
        res.send(404).send({message: "Order not found"});
    }
})
);

orderRouter.put(
    '/:id/pay',
    isAuth,
    expressAsyncHandler(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isPaid = true;
            order.paidAt = Date.now();
            order.paymentResult = {
                id: req.body.id,
                status: req.body.status,
                update_time: req.body.update_time,
                email_address: req.body.email_address,
            };
            const updateOrder = await order.save();
            res.send({message: 'Order Paid', order: updatedOrder});
        } else {
            res.status(404).send({message: "Order Not Found"});
        }

    })
);

export default orderRouter;