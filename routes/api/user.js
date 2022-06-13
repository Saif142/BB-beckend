const express = require('express')
const { findOne } = require('../../models/User')
const router = express.Router()

var _ = require('lodash')
const bcrypt = require('bcryptjs')
const { body, validationResult } = require('express-validator')
const User = require('../../models/User')
const Role = require('../../models/Roles')
const auth = require('../../middleware/auth')

//USER CREATE
router.post(
  '/:id',
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

    const { name, phone, password } = req.body
    const roleID = req.params.id

    try {
      const body = _.pick(req.body, ['name', 'phone', 'password'])
      const paramsRequired = ['name', 'phone', 'password']
      const check = checkRequestParams(body, paramsRequired)

      if (check.allOk == false) {
        return res.status(400).json('Missing' + ' ' + check.missing)
      }

      let user = await User.findOne({ name })
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User Name Already Exists' }] })
      }

      user = new User({
        name,
        phone,
        password,
        roleID,
      })

      //encrypt password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)

      await user.save()
      res.send('User Entered')
    } catch {
      res.status(500).send('server error')
    }
  }
)
//USER READ BY ID
router.get('/:id', async (req, res) => {
  // console.log('*********', req.body)

  try {
    const user = await User.findById(req.params.id).populate('roleID')

    if (!user) {
      return res.send('User not Found')
    } else {
      return res.json(user)
    }
  } catch {
    res.status(500).send('server error')
  }
})
//GET ALL USER
router.get('/', async (req, res) => {
  // console.log('*********', req.body)

  try {
    const user = await User.find().populate('roleID')

    return res.json(user)
  } catch {
    res.status(500).send('server error')
  }
})
//Update User
router.put('/update/:id/:phone', auth, async (req, res) => {
  try {
    let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
    console.log(user1)
    if (user1.roleID.roleType == 'Customer') {
      return res.status(400).json('Access Denied')
    }
    const user = await User.findByIdAndUpdate(req.params.id, {
      phone: req.params.phone,
    })

    await user.save()
    res.send('Updated')
  } catch {
    res.status(500).send('server error')
  }
})
//Delete User
router.delete('/:id', auth, async (req, res) => {
  try {
    let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
    console.log(user1)
    if (user1.roleID.roleType == 'Customer') {
      return res.status(400).json('Access Denied')
    }

    const user = await User.findByIdAndDelete(req.params.id)

    res.send('Deleted')
  } catch {
    res.status(500).send('server error')
  }
})

//Find User BY Roletype
router.get('/roleType/:type', async (req, res) => {
  try {
    const role = await Role.find({ roleType: req.params.type })
    const result = role.map((id) => id.userID)
    // await role.save()

    const user = await User.find({ _id: result })
    console.log(result)

    res.json(user)
  } catch {
    res.status(500).send('server error')
  }
})

module.exports = router
