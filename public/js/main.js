const chatForm = document.getElementById('form-chat')
const chatMessages = document.querySelector('.messages-chat')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const sidebar = document.querySelector('.sidebar-chat')
const userName = document.querySelector('.users-name')
const align = document.querySelector('.message')

//Get username and room from url
const { name, chatroom } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})

const socket = io()

//Join Chatroom
socket.emit('joinRoom', { name, chatroom })

//get room and users
socket.on('roomUser', ({ chatroom, users }) => {
  outputRoomName(chatroom)
  outputUsers(users)
})

//message frm server
socket.on('message', (message) => {
  outputMessage(message, 'left')

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight
})

//Welcom message
socket.on('messageWelcome', (message) => {
  displayWelcome(message)

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight
})

//Connect and leave message
socket.on('messageConnection', (message) => {
  displayConnection(message)

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight
})

//message ny user itself to be displayed at right
socket.on('messageRight', (message) => {
  console.log(message)
  outputMessage(message, 'right')

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight
})

//Message submit
chatForm.addEventListener('submit', (e) => {
  //usually it submit in new file.. we need to prevent it
  e.preventDefault()

  //Get message text
  let msg = e.target.elements.msg.value
  msg = msg.trim()
  if (!msg) {
    return false
  }
  //Display in left for current user

  //Emit message to server
  socket.emit('chatMessage', msg)

  chatMessages.scrollTop = chatMessages.scrollHeight
  //After that clear input
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})

//Output message to DOM
function outputMessage(message, position) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.classList.add(position)
  div.innerHTML = `<p class="meta">${message.username} &nbsp;&nbsp;<span>${message.time}</span></p>
    <p class="text">${message.text}</p>`

  document.querySelector('.messages-chat').appendChild(div)
}

function displayWelcome(message) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.classList.add('left')
  div.innerHTML = `
    <p class="text meta">${message.text}<span>${message.username}</span></p>`

  document.querySelector('.messages-chat').appendChild(div)
}

function displayConnection(message) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.classList.add('left')
  div.innerHTML = `
    <p class="text meta">${message.text}</p>`

  document.querySelector('.messages-chat').appendChild(div)
}

function displayLeft(message, position) {
  console.log(message)
  const div = document.createElement('div')
  div.classList.add('message')
  div.classList.add(position)
  div.innerHTML = `<p class="meta">You <span>${message.time}</span></p>
    <p class="text">${message.text}</p>`

  document.querySelector('.messages-chat').appendChild(div)
}

//add room name to DOM
function outputRoomName(chatroom) {
  roomName.innerText = chatroom
}

//Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
        ${users.map((user) => `<li>${user.name}</li>`).join('')}
    `
  userName.scrollTop = userName.scrollHeight
}

document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?')
  if (leaveRoom) {
    window.location = '../index.html'
  } else {
  }
})
