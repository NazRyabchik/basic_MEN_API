const connection = require('../mongo/connection'),
  mongoose = require('mongoose'),
  modelName = 'Lists'


const Lists = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: new Date()
  },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Items'
    }
  ]
}, { collection: modelName })


module.exports = connection.model(modelName, Lists)

