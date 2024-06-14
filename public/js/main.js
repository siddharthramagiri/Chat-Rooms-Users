const socket = io();
const chatform = document.getElementById("chat-form");
const chatMsgs = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");


// socket.on('url',({username,room}) => {
//     const {username, room} = {username,room};
// });

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix : true });
socket.emit('joinroom', ({username , room}));

socket.on('roomUsers',({room,users}) => {
    outputRoomName(room);
    outputUsers(users);
})

socket.on('message',message => {
    console.log(message);
    outputMessage(message);

    chatMsgs.scrollTop = chatMsgs.scrollHeight;
});

chatform.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const msg = evt.target.elements.msg.value;

    socket.emit(`chatMsg`, msg );

    evt.target.elements.msg.value = '';
})

function outputMessage(message) {
    // chatMsgs.innerHTML+=`<div class="message">
    //     <p class="meta">Mary <span>9:15pm</span></p>
    //     <p class="text">
    //         ${message}
    //     </p>
    // </div>`;

    //OR

    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
						<p class="text">
							${message.text}
						</p>`;
    chatMsgs.appendChild(div);

}

function outputRoomName(room) {
    roomName.innerText = room;
}

function outputUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}