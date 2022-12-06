const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector('.chat-messages');
const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true});
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const socket = io();

// Join Chat
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({room, users})=>{
  outputRoomName(room);
  outputUsers(users);

});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // scroll down to latest message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // get  message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//Output message to Dom

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username }<span>${message.time}</span></p>
    <p class="test">
     ${message.text}
     </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}


// ADD room name to DOm
 function outputRoomName(room){
  roomName.innerText = room;
 }

 // Add users to DOM
 function outputUsers(users){
  userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
 }