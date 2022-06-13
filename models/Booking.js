const mongoose = require('mongoose')

const BookingSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  roomID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'rooms',
  },
  checkIn: {
    type: Date,
    // default: Date.now,
    required: true,
  },
  checkOut: {
    type: Date,
    // default: Date.now,
  },
})

module.exports = Booking = mongoose.model('booking', BookingSchema)
