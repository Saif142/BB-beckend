const mongoose = require('mongoose')

const RoleSchema = new mongoose.Schema({
  roleType: {
    type: String,
    required: true,
  },
})

module.exports = Role = mongoose.model('roles', RoleSchema)
