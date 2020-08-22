const connection = require('../mongo/connection'),
  mongoose = require('mongoose'),
  modelName = 'Items'


const Items = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: new Date()
  },
  isFinished: {
    type: mongoose.Schema.Types.Boolean,
    default: false
  },
  task: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  description: {
    type: mongoose.Schema.Types.String,
  },
  image: {
    type: mongoose.Schema.Types.String,
  },
  todoList: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lists'
  }
}, { collection: modelName })


module.exports = connection.model(modelName, Items)
