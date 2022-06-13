const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
  roomNo: {
    type: Number,
    required: true,
  },
  roomBeds: {
    type: Number,
    required: true,
  },
})

module.exports = Room = mongoose.model('rooms', RoomSchema)
