const express = require('express'),
  router = express.Router(),
  todoListItemService = require('../services/todoListItemService'),
  authMiddleware = require('../middleware/authMiddleware'),
  multerMiddleware = require('../middleware/multerMiddleware')


router.use(authMiddleware.checkToken)
router.use(authMiddleware.checkVerified)


router
  .route('/')
    .post(multerMiddleware.multerSingleImg, todoListItemService.createTodoListItem)
    .get(todoListItemService.getAllTodoListItems)
    .patch(multerMiddleware.multerSingleImg, todoListItemService.updateTodoListItemImage)

router
  .route('/:id')
    .get(todoListItemService.getOneTodoListItem)
    .delete(todoListItemService.deleteOneTodoListItem)
    .put(todoListItemService.toggleOneTodoListItem)


module.exports = router
