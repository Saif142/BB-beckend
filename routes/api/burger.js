const express = require('express')
const router = express.Router()

const bcrypt = require('bcryptjs')
const config = require('config')
const Burger = require('../../models/Burger')

//Create User

router.post('/', async (req, res) => {
  const { email, password } = req.body

  try {
    if (email || password) {
      let user = await Burger.findOne({ email })
      if (user) {
        return res.send('User Already Exists')
      }

      user = new Burger({
        email,
        password,
        lettuce: '0',
        tomato: '0',
        meat: '0',
        cheese: '0',
        price: '3',
      })

      //encrypt password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)

      await user.save()
      res.send('User Entered')
    } else {
      return res.send('Please Enter Proper Credentials ')
    }
  } catch {
    res.status(500).send('server error')
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    let user = await Burger.findOne({ email })

    if (!user) {
      return res.send('User Does not exist')
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.send('Invalid Credentials')
    }

    //return jsonwebtoken

    return res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

router.put('/cook/:id', async (req, res) => {
  const { lettuce, tomato, meat, cheese, price } = req.body

  console.log(req.body)
  try {
    const user = await Burger.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          lettuce: lettuce,
          tomato: tomato,
          meat: meat,
          cheese: cheese,
          price: price,
        },
      }
    )
    // user.kingBuger.unshift(ingredients)
    return res.send('Succeefully Logged out')
  } catch {}
})

module.exports = router
