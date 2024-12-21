const express = require('express');
const router = express.Router();
const isLoggedIn = require('../middlewares/isLoggedIn');
const Product = require('../models/product-model');
const userModel = require('../models/user-model');


router.get('/', (req,res)=>{
  let error = req.flash("error");
  res.render("index", { error , loggedin: false});
});

router.get('/shop', isLoggedIn, async (req,res)=>{
  try {
    const products = await Product.find();
    let success = req.flash("success"); 
    res.render('shop', { products, success }); 
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Internal server error');
  }
});

router.get('/cart', isLoggedIn, async (req,res)=>{
  try {
    let user = await userModel.findOne({email: req.user.email}).populate("cart");
    let bill = Number(user.cart[0].price + 20) - Number(user.cart[0].discount);
    res.render('cart', {user, bill}); 
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Internal server error');
  }
});

router.get('/addtocart/:productid', isLoggedIn, async (req,res)=>{
  try {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart.push(req.params.productid);
    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/shop");
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).send('Internal server error');
  }
});


module.exports = router;