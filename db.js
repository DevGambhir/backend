const mongoose = require('mongoose');

connectDB().catch(err => console.log(err));

async function connectDB() {
  await mongoose.connect("mongodb+srv://cryptocurrency:crypto123@cluster0.rio5ht7.mongodb.net/?retryWrites=true&w=majority");
  console.log("We are connected");

   
}

module.exports = connectDB;