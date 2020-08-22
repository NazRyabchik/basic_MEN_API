require('dotenv')
  .config({ encoding: 'latin1' })

const mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  randomString = require('random-base64-string'),
  httpStatusCodes = require('http-status-codes'),
  jwt = require('jsonwebtoken'),
  { Users } = require('../models')


async function userRegister(req, res) {
  try {
    const { name, password } = req.body,
    existingName = await Users.findOne({ name })  
    if (existingName) {
      return res.status(httpStatusCodes.CONFLICT).json({
        message: 'Name already exists'
      })
    } else {
      const hash = await bcrypt.hash(password, 10)  
      const user = new Users({
        _id: new mongoose.Types.ObjectId(),
        name,
        password: hash,
        verifyLink: {
          link: randomString(20),
          expirationDate: Date.now() + (1000 * 60) * 5
        }
      })
      await user.save()
      return res.status(httpStatusCodes.CREATED).json({
        user
      })
    }
  } catch (error) {
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
}

async function userVerify(req, res) {
  try {
    const user = await Users.findById(req.body.userID).select('-password')
    if (user.verifyLink.link === req.body.verifyLink && Date.now() < user.verifyLink.expirationDate) {
      user.isVerified = true
      user.verifyLink = undefined
      await user.save()
      return res.status(httpStatusCodes.CREATED).send(
        'User succesfully verified.'
      )
    } else {
      return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).send(
        'User verification failed.'
      )
    }
  } catch (error) {
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
}

async function userRefreshVerifyLink(req, res) {
  try {
    const user = await Users.findById(req.body.userID).select('-password')  
    if (user.isVerified === false) {
      user.verifyLink = {
          link: randomString(20),
          expirationDate: Date.now() + (1000 * 60) * 5
      }
      await user.save()
      return res.status(httpStatusCodes.OK).json({
        message: 'Verification link refreshed.',
        link: user.verifyLink.link
      })
    } else {
      res.status(httpStatusCodes.CONFLICT).json({
        message: 'Verification is not needed.'
      })
    }
  } catch (error) {
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
}

async function userSendStatus(req, res) {
  try {
    const user = await Users.findById(req.body.userID).select('-password -__v -createdAt')  
    return res.status(httpStatusCodes.OK).json({
      user
    })
  } catch (error) {
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
}

async function userSendJWTToken(req, res) {
  const { name, password } = req.body,
    user = await Users.findOne({ name })
  if (user) {
    const isPasswordCorrect = await bcrypt.compare(password, user.password)  
    if (isPasswordCorrect) {
      const token = jwt.sign({
        _id: user._id,
        name: user.name,
        createdAt: user.createdAt
      }, process.env.PORT, {
        expiresIn: '30d'
      })
      return res.status(httpStatusCodes.OK).json({
        message: 'Authorization Successful',
        token
      })
    } else {
      return res.status(httpStatusCodes.NOT_FOUND).json({
        message: 'Authorization failed'
      })
    }
  } else {
    return res.status(httpStatusCodes.NOT_FOUND).json({
      message: 'Authorization failed'
    })
  }
}

async function userRefreshJWTToken(req, res) {
  try {
    const user = await Users.findById(req.body.userID).select('-password'),
      token = jwt.sign({
        _id: user._id,
        name: user.name,
        createdAt: user.createdAt
      }, process.env.PORT, {
        expiresIn: '1h'
      })
    return res.status(httpStatusCodes.OK).json({
      message: 'Token refreshed',
      token
    })
  } catch (error) {
    return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
}


module.exports = {
  userRegister,
  userVerify,
  userRefreshVerifyLink,
  userSendStatus,
  userSendJWTToken,
  userRefreshJWTToken,
}
