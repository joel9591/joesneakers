 const mongoose = require('mongoose');

 mongoose.connect("mongodb://127.0.0.1:27017/joesneakers")
 .then(function(){
  console.log("connected to database");
 })
 .catch(function(err){
  console.log(err);
 }) 

 module.exports = mongoose.connection;

// const mongoose = require('mongoose');
// const config = require('config');

// const dbgr = require('debug')("development:mongoose");

// mongoose.connect(`${config.get("MONGODB_URI")}/joesneakers`)
// .then(function(){
//   dbgr("connected");
// })
// .catch(function(err){
//   dbgr(err);
// });

// module.exports = mongoose.connection;