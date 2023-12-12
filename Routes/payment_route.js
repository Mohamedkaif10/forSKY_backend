const Razorpay=require('razorpay')
const express = require('express')
require("dotenv").config()
const crypto = require("crypto")
const router = express.Router();

router.post("/order",async(req,res)=>{
    try{
        const razorpay= new Razorpay({
            key_id:process.env.RAZORPAY_ID_KEY,
            key_secret:process.env.RAZORPAY_SECRET_KEY
         })
         const options = req.body
         const order= await razorpay.orders.create(options);
         if(!order){
            return res.status(500).send('Error')
         }
         console.log("successfully gave placed the order",order)
         res.json(order)
    }catch (error) {
        console.error('Error processing Razorpay order:', error);
        res.status(500).json({ error: 'Error processing Razorpay order' });
    }
})
router.post("/order/validate",async(req,res)=>{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body
  const sha = crypto.createHmac("sha256",process.env.RAZORPAY_SECRET_KEY);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)
  const digest = sha.digest("hex")
  if(digest!== razorpay_signature){
    return res.status(400).json({msg:"Transaction is not legit"});
  }
  res.json({
    msg:"success",
    orderId:razorpay_order_id,
    paymentId:razorpay_payment_id,

  })
})

module.exports = router;