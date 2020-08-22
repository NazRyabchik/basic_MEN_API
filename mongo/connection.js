const mongoose = require('mongoose')  

// mongoose.connect()
const connection = mongoose.createConnection(
  'mongodb://localhost:27017',
  {
    dbName: 'Tasklists',
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  }
)

module.exports = connection
