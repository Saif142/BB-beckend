// const { check, validationResult } = require('express-validator')

checkRequestParams = (received, required) => {
  let allOk = true
  let missing = ''

  for (let item of required) {
    if (!(item in received)) {
      allOk = false
      missing = item
    }
  }
  // console.log(allOk, missing)
  return {
    allOk,
    missing,
  }
}

module.exports = { checkRequestParams }
