const express = require('express')
const router = express.Router()

var _ = require('lodash')
const { body, validationResult } = require('express-validator')
const Booking = require('../../models/Booking')
const User = require('../../models/User')
const auth = require('../../middleware/auth')

// //Booking ON Arivals
router.post(
  '/',
  auth,
  // [
  //   body('name', 'Name is required').not().isEmpty(),
  //   body('phone', 'Contact  is required').not().isEmpty(),
  //   body('password', 'Please enter password with 6').isLength({
  //     min: 6,
  //     max: 6,
  //   }),
  // ],
  async (req, res) => {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() })
    // }

    const { userID, roomID, checkIn, checkOut } = req.body

    try {
      const body = _.pick(req.body, ['userID', 'roomID', 'checkIn', 'checkOut'])
      const paramsRequired = ['userID', 'roomID', 'checkIn', 'checkOut']
      const check = checkRequestParams(body, paramsRequired)

      if (check.allOk == false) {
        return res.status(400).json('Missing' + ' ' + check.missing)
      }

      let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
      console.log(user1)
      if (user1.roleID.roleType == 'Customer') {
        return res.status(400).json('Access Denied')
      }

      let book = await Booking.findOne({ userID })
      if (book) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Already Have Booking' }] })
      }

      book = new Booking({
        userID,
        roomID,
        checkIn,
        checkOut,
      })

      await book.save()
      res.send('Booked')
    } catch {
      res.status(500).send('server error')
    }
  }
)

//GET ALL Bookings
router.get('/', async (req, res) => {
  try {
    const book = await Booking.find().populate('userID').populate('roomID')

    res.json(book)
  } catch {
    res.status(500).send('server error')
  }
})

// GET booking by User ID
router.get('/getBooking', auth, async (req, res) => {
  try {
    const book = await Booking.find({ userID: req.user.id })
      .populate('userID')
      .populate('roomID')
    return res.json(book)
  } catch {
    res.status(500).send('server error')
  }
})
//GET ALL Booking by date
router.get('/date/:date', auth, async (req, res) => {
  try {
    let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
    console.log(user1)
    if (user1.roleID.roleType == 'Customer') {
      return res.status(400).json('Access Denied')
    }

    const book = await Booking.find({
      checkIn: {
        $gte: new Date(new Date(req.params.date).setHours(00, 00, 00)),
        $lt: new Date(new Date(req.params.date).setHours(23, 59, 59)),
      },
    })
      .populate('userID')
      .populate('roomID')
    return res.json(book)
  } catch {
    res.status(500).send('server error')
  }
})
//GET ALL Booking from dates
router.get('/date/:date/:date2', auth, async (req, res) => {
  console.log('*********', req.params.date2)

  try {
    let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
    console.log(user1)
    if (user1.roleID.roleType == 'Customer') {
      return res.status(400).json('Access Denied')
    }

    const book = await Booking.find({
      checkIn: {
        $gte: new Date(new Date(req.params.date).setHours(00, 00, 00)),
        $lt: new Date(new Date(req.params.date).setHours(23, 59, 59)),
      },
    })
      .populate('userID')
      .populate('roomID')

    return res.json(book)
  } catch {
    res.status(500).send('server error')
  }
})

//CheckOut by booking ID
router.put(
  '/checkout/:id',
  auth,
  // [body('checkOut', 'Please Select date').not().isEmpty()],
  async (req, res) => {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() })
    // }
    console.log('*********', req.params.id)
    const { checkOut } = req.body

    console.log('****check**', checkOut)
    try {
      let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
      console.log(user1)
      if (user1.roleID.roleType == 'Customer') {
        return res.status(400).json('Access Denied')
      }

      const body = _.pick(req.body, ['checkOut'])
      const paramsRequired = ['checkOut']
      const check = checkRequestParams(body, paramsRequired)

      if (check.allOk == false) {
        return res.status(400).json('Missing' + ' ' + check.missing)
      }

      let book = await Booking.findOneAndUpdate(
        { _id: req.params.id },
        { checkOut: checkOut }
      )

      res.send('Checked Out')
    } catch {
      res.status(500).send('server error')
    }
  }
)

//CheckOut by UserID
router.put(
  '/checkUserOut/:id',
  auth,
  // [body('checkOut', 'Please Select date').not().isEmpty()],
  async (req, res) => {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() })
    // }
    console.log('*********', req.params.id)
    const { checkOut } = req.body

    console.log('****check**', checkOut)
    try {
      let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
      console.log(user1)
      if (user1.roleID.roleType == 'Customer') {
        return res.status(400).json('Access Denied')
      }

      const body = _.pick(req.body, ['checkOut'])
      const paramsRequired = ['checkOut']
      const check = checkRequestParams(body, paramsRequired)

      if (check.allOk == false) {
        return res.status(400).json('Missing' + ' ' + check.missing)
      }

      let book = await Booking.findOneAndUpdate(
        { userID: req.params.id },
        { checkOut: checkOut }
      )

      res.send('Checked Out')
    } catch {
      res.status(500).send('server error')
    }
  }
)
//CheckOut by Room ID
router.put(
  '/checkRoomOut/:id',
  auth,
  // [body('checkOut', 'Please Select date').not().isEmpty()],
  async (req, res) => {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() })
    // }
    console.log('*********', req.params.id)
    const { checkOut } = req.body

    console.log('****check**', checkOut)
    try {
      let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
      console.log(user1)
      if (user1.roleID.roleType == 'Customer') {
        return res.status(400).json('Access Denied')
      }

      const body = _.pick(req.body, ['checkOut'])
      const paramsRequired = ['checkOut']
      const check = checkRequestParams(body, paramsRequired)

      if (check.allOk == false) {
        return res.status(400).json('Missing' + ' ' + check.missing)
      }

      let book = await Booking.findOneAndUpdate(
        { roomID: req.params.id },
        { checkOut: checkOut }
      )

      res.send('Checked Out')
    } catch {
      res.status(500).send('server error')
    }
  }
)

//Delete Booking BY RoomNO
router.delete('/roomNO/:no', auth, async (req, res) => {
  try {
    let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
    console.log(user1)
    if (user1.roleID.roleType == 'Customer') {
      return res.status(400).json('Access Denied')
    }

    const book = await Booking.findOneAndDelete({ roomID: req.params.no })

    res.send('Deleted')
  } catch {
    res.status(500).send('server error')
  }
})
//Delete Booking BY bookID
router.delete('/bookID/:no', auth, async (req, res) => {
  try {
    let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
    console.log(user1)
    if (user1.roleID.roleType == 'Customer') {
      return res.status(400).json('Access Denied')
    }

    const book = await Booking.findOneAndDelete({ _id: req.params.no })

    res.send('Deleted')
  } catch {
    res.status(500).send('server error')
  }
})
//Delete Booking BY USER ID
router.delete('/userID/:no', auth, async (req, res) => {
  try {
    let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
    console.log(user1)
    if (user1.roleID.roleType == 'Customer') {
      return res.status(400).json('Access Denied')
    }

    const book = await Booking.findOneAndDelete({ userID: req.params.no })

    res.send('Deleted')
  } catch {
    res.status(500).send('server error')
  }
})

module.exports = router
