const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/generateToken');

module.exports.registerUser = async (req, res) => {
  try {
    const { email, password, fullname } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).send('User already exists'); 
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      email,
      password: hashedPassword,
      fullname,
    });

    const token = generateToken(user);

    res.cookie('token', token);
    //return res.status(201).send('User created successfully');
    res.redirect('/shop');
  } catch (err) {
    console.error(err); 
    return res.status(500).send('An error occurred. Please try again later.');
  }
};


module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      req.flash('error', 'email or password incorrect');
      return res.redirect("/");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      let token = generateToken(user);
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/shop");
    } else {
      req.flash("error", "email or password incorrect");
      return res.redirect("/");
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal server error');
  }
};

module.exports.logout = (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
}