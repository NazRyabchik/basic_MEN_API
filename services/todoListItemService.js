const mongoose = require('mongoose'),
  { Lists, Items } = require('../models')


  async function createTodoListItem(req, res) {
  try {
    const {task, description, listID} = req.body,
      todoList = await Lists.findById(listID)
    if ( todoList.owner == req.user._id ) {
    const todoListItem = new Items({
        _id: new mongoose.Types.ObjectId(),
        task,
        description,
        todoList: listID,
        image: req.file.path,
      })
    todoList.items.push(todoListItem._id)
    await todoList.save()
    await todoListItem.save()
    res.status(201).send(`Item ${todoListItem._id} created.`)
    } else {
      res.status(500).send('Cannot create an item.')
    }
  } catch (error) {
    res.status(500).send('Cannot create an item.')
  }
}

async function getAllTodoListItems(req, res) {
  try {
    const lists = await Lists
      .find( {owner: req.user._id})
      .find(req.query.todoListID ? { todoList: req.query.todoListID } : null)
      .exec()
    let itemIDs = []
    for (let list of lists) {
      itemIDs = itemIDs.concat(list.items)
    }
    const items = await Items.find({ _id: { $in: itemIDs } })
    res.status(200).json(items)
  } catch (error) {
    res.status(500).send('Cannot get items.')
  }
}

async function getOneTodoListItem(req, res) {
  try {
    const list = await Lists
      .findOne({ items: {$eq: req.params.id} })
    if (list.owner == req.user._id) {
      const item = await Items.findById(req.params.id)
      return res.status(200).json(item)
    } else {
      return res.status(404).send('Item not found.')
    }
  } catch (error) {
    res.status(500).send('Cannot get item.')
  }
}

async function deleteOneTodoListItem(req, res) {
  try {
    const item = await Items.findOne({ _id: req.params.id }),
      list = await Lists
        .findOne({ items: {$eq: req.params.id} })
    if (list.owner == req.user._id) {
      Items.findByIdAndDelete(req.params.id).exec()
      return res.status(200).send(`Item ${req.params.id} deleted.`)
    } else {
      return res.status(500).send('Cannot delete item.')
    }
  } catch (error) {
    res.status(500).send('Cannot delete item.')
  }
}

async function toggleOneTodoListItem(req, res) {
  try {
    const item = await Items.findOne({ _id: req.params.id }),
      list = await Lists
      .findOne({ items: {$eq: req.params.id} })
    if (list.owner == req.user._id) {
      item.isFinished = !item.isFinished
      await item.save()  
    }
    return res.status(200).json(item)
  } catch (error) {
    res.status(500).send('Cannot toggle an item.')  
  }
}

async function updateTodoListItemImage(req, res) {
  try {
    const { todoListItemID } = req.body,
    todoListItem = await Items.findById(todoListItemID),
    todoList = await Lists.findOne({ items: {$eq: todoListItemID} })
    if ( todoList.owner == req.user._id ) {
      todoListItem.image = req.file.path
    await todoListItem.save()
    res.status(201).send(`Image of ${todoListItemID} updated.`)
    } else {
      res.status(500).send('Cannot update an item.')
    }
  } catch (error) {
    res.status(500).send('Cannot update an item.')
  }
}


module.exports = {
  createTodoListItem,
  getAllTodoListItems,
  getOneTodoListItem,
  deleteOneTodoListItem,
  toggleOneTodoListItem,
  updateTodoListItemImage
}
