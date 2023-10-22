const socket = io();

// se genera la variable user para identificar la persona que escribe el mensaje
let user;
let chatBox = document.getElementById("chatBox");

//Uso el sweetalert para tomar el nombre para el chat
Swal.fire({
  title: "Indentificate",
  input: "text",
  text: "Ingrese el usuario para identificarte en el chat",
  inputValidator: (value) => {
    return !value && "necesitas escribir un nombre para continuar";
  },
  allowOutsideClick: false,
})
  .then((result) => {
    user = result.value;
    // una vez que el usuario ingresa  lo guardamos en la variable user
  })
  //una vez que el usuario coloco recibimos del servidor el historial para saber si ya hay mensajes
  .then(() => {
    socket.emit("historial");
  });

chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value });
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  let log = document.getElementById("messageLogs");
  let messages = "";
  data.forEach((message) => {
    messages = messages + `${message.user} :${message.message}</br>`;
  });
  log.innerHTML = messages;
});
