const express = require('express'),
  cors = require('cors'),
  app = express(),
  bodyParser = require('body-parser'),
  todoListRoutes = require('./routes/todoListRoutes'),
  todoListItemRoutes = require('./routes/todoListItemRoutes'),
  userRoutes = require('./routes/userRoutes')

require('dotenv')
  .config({ encoding: 'latin1' })


app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/todoListItem', todoListItemRoutes)
app.use('/todoList', todoListRoutes)
app.use('/user', userRoutes)


app.listen(process.env.PORT, () => {
  console.log(`App running on http://localhost:${ process.env.PORT }`)
})
