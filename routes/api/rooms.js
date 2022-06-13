const express = require('express')
const router = express.Router()
const multer = require('multer')

var _ = require('lodash')
const { body, validationResult } = require('express-validator')
const Room = require('../../models/Rooms')
const auth = require('../../middleware/auth')

//Multer file storage

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    var ext = file.mimetype.split('/')[1]
    cb(null, file.fieldname + '-' + Date.now() + '.' + ext)
  },
})

var upload = multer({ storage: storage })

//ROOM PIC UPLOAD

router.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  try {
    const file = req.file
    if (!file) {
      res.status(400).send('File is not  upload')
    }
    res.send(file)
  } catch {
    res.status(500).send('server error')
  }
})

//CREATE ROOMS
router.post(
  '/',
  // [
  //   body('roomNo', 'Enter Room NO').not().isEmpty(),
  //   body('roomBeds', 'Enter no of Beds').not().isEmpty(),
  // ],
  async (req, res) => {
    console.log('*********', req.body)
    const { roomNo, roomBeds } = req.body
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() })
    // }
    try {
      const body = _.pick(req.body, ['roomNo', 'roomBeds'])
      const paramsRequired = ['roomNo', 'roomBeds']
      const check = checkRequestParams(body, paramsRequired)

      if (check.allOk == false) {
        return res.status(400).json('Missing' + ' ' + check.missing)
      }

      const find = Room.findOne({ roomNo: roomNo })

      if (find) {
        res.send('Room Already Exist')
      } else {
        let room = new Room({
          roomNo,
          roomBeds,
        })
        await room.save()
        res.send('Room Entered')
      }
    } catch {
      res.status(500).send('server error')
    }
  }
)

//GET ROOM BY ID
router.get('/:id', async (req, res) => {
  // console.log('*********', req.body)

  try {
    const room = await Room.findById(req.params.id)

    if (!room) {
      res.send('Room not Found')
    } else {
      res.json(room)
    }
  } catch {
    res.status(500).send('server error')
  }
})
//GET ROOM BY ROOM NO
router.get('/roomNO/:no', async (req, res) => {
  // console.log('*********', req.body)

  try {
    const room = await Room.findOne({ roomNo: req.params.no })

    if (!room) {
      res.send('Room not Found')
    } else {
      res.json(room)
    }
  } catch {
    res.status(500).send('server error')
  }
})
//GET ALL ROOMS
router.get('/', async (req, res) => {
  // console.log('*********', req.body)

  try {
    const room = await Room.find()

    res.json(room)
  } catch {
    res.status(500).send('server error')
  }
})
//Update ROOM
router.put(
  '/update/:id',
  auth,
  // [
  //   body('roomNo', 'Enter Room NO').not().isEmpty(),
  //   body('roomBeds', 'Enter no of Beds').not().isEmpty(),
  // ],
  async (req, res) => {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() })
    // }
    // console.log('*********', req.body)
    const { roomNo, roomBeds } = req.body

    try {
      let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
      console.log(user1)
      if (user1.roleID.roleType == 'Customer') {
        return res.status(400).json('Access Denied')
      }

      const body = _.pick(req.body, ['roomNo, roomBed'])
      const paramsRequired = ['roomNo, roomBed']
      const check = checkRequestParams(body, paramsRequired)

      if (check.allOk == false) {
        return res.status(400).json('Missing' + ' ' + check.missing)
      }

      const room = await Room.findOneAndUpdate(
        { _id: req.params.id },
        {
          $set: { roomNo: roomNo, roomBeds: roomBeds },
        }
      )

      await room.save()
      res.send('Updated')
    } catch {
      res.status(500).send('server error')
    }
  }
)
//Delete ROOM BY ID
router.delete('/:id', auth, async (req, res) => {
  try {
    let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
    console.log(user1)
    if (user1.roleID.roleType == 'Customer') {
      return res.status(400).json('Access Denied')
    }

    const room = await Room.findByIdAndDelete(req.params.id)

    res.send('Deleted')
  } catch {
    res.status(500).send('server error')
  }
})
//Delete ROOM BY RoomNO
router.delete('/roomNO/:no', auth, async (req, res) => {
  try {
    let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
    console.log(user1)
    if (user1.roleID.roleType == 'Customer') {
      return res.status(400).json('Access Denied')
    }

    const room = await Room.findOneAndDelete({ roomNo: req.params.no })

    res.send('Deleted')
  } catch {
    res.status(500).send('server error')
  }
})

module.exports = router
