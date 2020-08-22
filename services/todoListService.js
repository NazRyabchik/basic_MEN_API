const mongoose = require('mongoose'),
  { Lists, Users } = require('../models')


async function createTodoList(req, res) {
  try {
    const user = await Users.findById(req.user._id),
      list = new Lists({
        _id: new mongoose.Types.ObjectId(),
        owner: req.user._id
      }),
      listID = list._id
    user.lists.push(list._id)
    await list.save()
    await user.save()
    res.status(201).send(`List ${listID} created.`)
  } catch (error) {
    res.status(500).send('Cannot create a todo list')
  }
}

async function getAllTodoLists(req, res) {
  try {
    const lists = await Lists
      .find({ owner: req.user._id })
      .exec()
    res.status(200).json(lists)
  } catch (error) {
    res.status(500).send('Cannot get todo lists.')
  }
}

async function getOneTodoList(req, res) {
  try {
    Lists.findOne({
      _id: req.params.id,
      owner: req.user._id
    })
    .then(listFound => {
      if (!listFound) {
        return res.status(404).send("List not found.")
      }
      return res.status(200).json(listFound)
    })
  } catch (error) {
    res.status(500).send('Cannot get a todo list.')
  }
}

async function deleteOneTodoList(req, res) {
  try {
    Lists.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    })
    .then(listDeleted => {
      if (!listDeleted) {
        return res.status(404).send("List not found.")
      }
      return res.status(200).send("List deleted.")
    })
  } catch (error) {
    res.status(500).send('Cannot delete a todo list.')
  }
}


module.exports = {
  createTodoList,
  getAllTodoLists,
  getOneTodoList,
  deleteOneTodoList
}
