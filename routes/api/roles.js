const express = require('express')
const router = express.Router()

var _ = require('lodash')
const Roles = require('../../models/Roles')
const User = require('../../models/User')
const auth = require('../../middleware/auth')

//Create Role
router.post('/', async (req, res) => {
  const { roleType } = req.body

  try {
    const body = _.pick(req.body, ['roleType'])
    const paramsRequired = ['roleType']
    const check = checkRequestParams(body, paramsRequired)

    if (check.allOk == false) {
      return res.status(400).json('Missing' + ' ' + check.missing)
    }
    let role = new Roles({
      roleType,
    })
    await role.save()
    res.send('Roles Entered')
  } catch {
    res.status(500).send('server error')
  }
})

//Find role BY Roletype
router.get('/roleType/:type', auth, async (req, res) => {
  try {
    let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
    console.log(user1)
    if (user1.roleID.roleType == 'Customer') {
      return res.status(400).json('Access Denied')
    }

    const role = await Roles.find({ roleType: req.params.type })

    res.json(role)
  } catch {
    res.status(500).send('server error')
  }
})

// //USER ROLE BY ID
router.get('/:id', auth, async (req, res) => {
  try {
    let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
    console.log(user1)
    if (user1.roleID.roleType == 'Customer') {
      return res.status(400).json('Access Denied')
    }

    const role = await Roles.findById(req.params.id)

    if (!role) {
      res.send('Role not found')
    } else {
      res.json(role)
    }
  } catch {
    res.status(500).send('server error')
  }
})

//USER ROLE BY USER ID
// router.get('/userID/:id', async (req, res) => {
//   try {
//     const role = await Roles.findOne({ userID: req.params.id })

//     if (!role) {
//       res.send('Role not found')
//     } else {
//       res.json(role)
//     }
//   } catch {
//     res.status(500).send('server error')
//   }
// })
//GET ALL ROLES
router.get('/', async (req, res) => {
  try {
    const role = await Roles.find()

    res.json(role)
  } catch {
    res.status(500).send('server error')
  }
})
//Update ROLE bY ID
router.put('/update/:id/:type', auth, async (req, res) => {
  try {
    let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
    console.log(user1)
    if (user1.roleID.roleType == 'Customer') {
      return res.status(400).json('Access Denied')
    }

    const role = await Roles.findByIdAndUpdate(req.params.id, {
      roleType: req.params.type,
    })

    await role.save()
    res.send('Updated')
  } catch {
    res.status(500).send('server error')
  }
})
//Update ROLE BY USER ID
// router.put('/updateID/:id/:type', async (req, res) => {
//   try {
//     const role = await Roles.findOneAndUpdate(
//       { userID: req.params.id },
//       { $set: { roleType: req.params.type } },
//       { new: true }
//     )

//     await role.save()
//     res.send('Updated')
//   } catch {
//     res.status(500).send('server error')
//   }
// })
//Delete ROLE
router.delete('/:id', auth, async (req, res) => {
  try {
    let user1 = await User.findById({ _id: req.user.id }).populate('roleID')
    console.log(user1)
    if (user1.roleID.roleType == 'Customer') {
      return res.status(400).json('Access Denied')
    }

    const role = await Roles.findByIdAndDelete(req.params.id)

    res.send('Deleted')
  } catch {
    res.status(500).send('server error')
  }
})
//Delete ROLE BY USER ID
// router.delete('/userID/:id', async (req, res) => {
//   try {
//     const role = await Roles.findOneAndDelete({ userID: req.params.id })

//     res.send('Deleted')
//   } catch {
//     res.status(500).send('server error')
//   }
// })

module.exports = router
