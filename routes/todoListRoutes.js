const express = require('express'),
  router = express.Router(),
  todoListService = require('../services/todoListService'),
  authMiddleware = require('../middleware/authMiddleware')


router.use(authMiddleware.checkToken)
router.use(authMiddleware.checkVerified)


router
  .route('/')
    .post(todoListService.createTodoList)
    .get(todoListService.getAllTodoLists)

router
  .route('/:id')
    .get(todoListService.getOneTodoList)
    .delete(todoListService.deleteOneTodoList)


module.exports = router
