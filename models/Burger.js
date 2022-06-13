const mongoose = require('mongoose')

const BurgerSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  lettuce: {
    type: Number,
  },
  tomato: {
    type: Number,
  },
  cheese: {
    type: Number,
  },
  meat: {
    type: Number,
  },
  price: {
    type: Number,
  },
})

module.exports = Burger = mongoose.model('burger', BurgerSchema)
