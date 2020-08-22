const express = require('express'),
  userService = require('../services/userService'),
  router = express.Router()


router
  .route('/')
    .post(userService.userRegister)
    .get(userService.userSendStatus)

router
  .route('/login')
    .post(userService.userSendJWTToken)

router
  .route('/refresh')
    .get(userService.userRefreshJWTToken)

router
  .route('/verify')
    .post(userService.userVerify)
    .patch(userService.userRefreshVerifyLink)


module.exports = router
