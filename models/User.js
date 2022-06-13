const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  jwt: {
    type: String,
  },
  roleID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'roles',
  },
})

module.exports = User = mongoose.model('users', UserSchema)
