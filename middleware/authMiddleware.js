require('dotenv')
  .config({ encoding: 'latin1' })

const jwt = require('jsonwebtoken'),
  httpStatusCodes = require('http-status-codes'),
  { Users } = require('../models')



const checkToken = (req, res, next) => {
  if (req.header('authorization')) {
    const token = req.header('authorization').split(' ')[1]
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        return res.status(httpStatusCodes.UNAUTHORIZED).send(
          'Invalid authorization token.'
        )
      } else {
        req.user = decoded
        next()
      }
    })
  } else {
    return res.status(httpStatusCodes.UNAUTHORIZED).send(
      'Authorization token is not supplied.'
    )
  }
}

const checkVerified = async (req, res, next) => {
  const user = await Users.findById(req.user._id).select('-password').exec
  if (user.verifyLink != undefined) {
    return res.status(httpStatusCodes.UNAUTHORIZED).send(
      'Please verify your account first.'
    )
  } else {
    next()
  }
}


module.exports = {
  checkToken,
  checkVerified,
}
