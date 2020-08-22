const connection = require('../mongo/connection'),
  mongoose = require('mongoose'),
  modelName = 'Users'


const Users = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true
  },
  password: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  isVerified: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
    required: true
  },
  verifyLink: {
    link: {
      type: mongoose.Schema.Types.String
    },
    expirationDate: {
      type: mongoose.Schema.Types.Date
    }
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: new Date()
  },
  _id: {
    type: mongoose.Schema.Types.ObjectId
  },
  lists: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lists'
    }
  ]
}, { collection: modelName })


module.exports = connection.model(modelName, Users)
