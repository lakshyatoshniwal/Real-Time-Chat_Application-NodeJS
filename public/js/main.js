const chatForm = document.getElementById('form-chat')
const chatMessages = document.querySelector('.messages-chat')
const roomName = document.getElementById('room-name')
const userList = document.getElementById('users')
const sidebar = document.querySelector('.sidebar-chat')
const userName = document.querySelector('.users-name')
//Get username and room from url
const { name, chatroom } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
})
chatMessages.style.height = window.innerHeight
sidebar.style.height = window.innerHeight
// mainDiv.style.height = window.innerHeight

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
  console.log(message)
  outputMessage(message)

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
  //Emit message to server
  socket.emit('chatMessage', msg)

  //After that clear input
  e.target.elements.msg.value = ''
  e.target.elements.msg.focus()
})

//Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div')
  div.classList.add('message')
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
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
