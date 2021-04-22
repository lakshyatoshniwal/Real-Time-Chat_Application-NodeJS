const path = require('path')
const http = require('http') //TO create server
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

//Set static folder
app.use(express.static(path.join(__dirname, 'public')))

const botName = 'GAPSHAP Bot'

//Run when a client connect
io.on('connection', (socket) => {
  // Three ways to emet a message
  // 1. socket.emit() emit a personal Message
  // 2. socket.broadcast.emit()  emit to everyone except that person
  // 3. io.emit()   emit to everyone

  socket.on('joinRoom', ({ name, chatroom }) => {
    const user = userJoin(socket.id, name, chatroom)
    socket.join(user.chatroom)

    //Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to Gapshap...'))

    //Braoadcast when a user connect
    socket.broadcast
      .to(user.chatroom)
      .emit(
        'message',
        formatMessage(botName, `${user.name} has joined the chat`)
      )

    //Send users and room info
    io.to(user.chatroom).emit('roomUser', {
      chatroom: user.chatroom,
      users: getRoomUsers(user.chatroom),
    })
  })

  //Listen for chatMessage
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id)
    io.to(user.chatroom).emit('message', formatMessage(user.name, msg))
  })

  //Runs when client disconnect
  socket.on('disconnect', () => {
    const user = userLeave(socket.id)
    if (user) {
      io.to(user.chatroom).emit(
        'message',
        formatMessage(botName, `${user.name} has left the chat`)
      )
      //Send users and room info
      io.to(user.chatroom).emit('roomUser', {
        chatroom: user.chatroom,
        users: getRoomUsers(user.chatroom),
      })
    }
  })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
