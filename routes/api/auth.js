const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')

const { checkRequestParams } = require('../../common/utils')

var _ = require('lodash')

// const { check, validationResult } = require('express-validator')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../../models/User')

router.post(
  '/',
  // [
  //   check('name', 'Name is required').not().isEmpty(),
  //   check('phone', 'Please Enter Valid no')
  //     .not()
  //     .isEmpty()
  //     .isLength({ min: 10, max: 10 }),
  //   check(
  //     'password',
  //     'Please enter password with 6  or more charcter'
  //   ).isLength({ min: 6, max: 6 }),
  // ],
  async (req, res) => {
    // const errors = validationResult(req)
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() })
    // }
    const { name, password } = req.body
    try {
      const body = _.pick(req.body, ['name', 'phone', 'password'])
      const paramsRequired = ['name', 'phone', 'password']
      const check = checkRequestParams(body, paramsRequired)

      if (check.allOk == false) {
        return res.status(400).json('Missing' + ' ' + check.missing)
      }
      let user = await User.findOne({ name })
      var newToken = ''
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

      //compare password
      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

      //return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        async (err, token) => {
          if (err) throw err
          if (token) {
            newToken = token
            await User.updateOne({ name: name }, { jwt: newToken })
            await user.save()
            res.json({ newToken, name: name })
          }
        }
      )
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)
module.exports = router
