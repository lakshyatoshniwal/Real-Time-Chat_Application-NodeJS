const users = []

//Join user to chat

function userJoin(id, name, chatroom) {
  const user = { id, name, chatroom }
  users.push(user)
  return user
}

//Get curent user

function getCurrentUser(id) {
  return users.find((user) => user.id === id)
}

//User leave chat
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id)
  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

//Get room users
function getRoomUsers(chatroom) {
  return users.filter((user) => user.chatroom === chatroom)
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
}
