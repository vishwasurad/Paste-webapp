const {Schema,model} = require("mongoose");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique:true,
  },
  password: {
    type: String,
    required: true,
  },
  role:{
    type: String,
    required: true,
    default:"NORMAL",
  }

},{timestamps:true});

const userModel = model("user", userSchema)

module.exports = userModel