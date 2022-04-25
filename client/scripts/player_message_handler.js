class PlayerMessageHandler {
  static sendMessage() {
    let elapsed = Time.getElapsedTime();
    if (elapsed - Time.lastTimeMessage > 1.0) {
      let message = Text.messageInput.value;

      Networking.server_socket.emit("send_message", message);
      PlayerMessageHandler.appendMessage("You", message);
      Time.lastTimeMessage = elapsed;
      Text.messageInput.value = "";
    }
  }
  static onMessage(data) {
    PlayerMessageHandler.appendMessage(data.name, data.message);
  }

  static appendMessage(name, message) {
    const messageElement = document.createElement("p");
    messageElement.innerText = name + " : " + message;
    Text.messageContainer.append(messageElement);
  }
}
