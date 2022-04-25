class Text {
  //Start Menu
  static start_menu = document.getElementById("start-menu");
  static start_menu_input = document.getElementById("start-menu-input");

  //Char
  static chatDiv = document.getElementById("chat");
  static messageContainer = document.getElementById("message-container");
  static messageInput = document.getElementById("message-input");
  static messageForm = document.getElementById("send-button");

  //Ui
  static health_ui = document.getElementById("ui");
  static div = document.getElementById("game");
  static position = document.createElement("h1");
  static fps = document.createElement("h1"); //document.getElementById("fps");
  static current_block = document.createElement("current_block");

  static health_bar_slider = document.getElementById("health-bar-slider");
  static health_bar_background = document.getElementById(
    "health-bar-background"
  );
  static health_bar_text = document.getElementById("health-bar-text");

  static onStartGame() {
    let user_name = Text.start_menu_input.value;
    if (user_name !== "" && user_name !== null) {
      screen_world.init(user_name);
    }
  }

  static init() {
    Text.start_menu.remove();

    Text.div.append(Text.position);
    Text.position.className = "position-overlay";

    Text.div.append(Text.fps);
    Text.fps.className = "fps-overlay";

    Text.div.append(Text.current_block);
    Text.current_block.className = "current-block-overlay";

    Text.messageForm.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("H");
    });
  }

  static update() {
    let chatPositionY = canvas.height - 150 + "px";

    let position = player.player_model.position;
    let positionText =
      "Position : " + Math.floor(position.x) + " " + Math.floor(position.y);
    let fps = "Fps : " + Math.floor(Time.getFps());
    let item = player.inventory.items[player.inventory.current_item].item_name;

    let health = Math.floor(player.player_model.health);
    let health_bar_height = canvas.height - 100 + "px";
    let health_bar_width = 300 * (health / 100) + "px";

    //Chat
    Text.health_bar_background.style.top = health_bar_height;
    Text.health_bar_text.style.top = health_bar_height;
    Text.health_bar_slider.style.top = health_bar_height;
    Text.health_bar_slider.style.width = health_bar_width;
    Text.current_block.style.left = canvas.width / 2 - 23;
    Text.current_block.style.top = canvas.height - 50;
    Text.chatDiv.style.top = chatPositionY;

    //Position
    Text.position.innerHTML = positionText;
    Text.fps.innerHTML = fps;
    Text.current_block.innerHTML = item;
    Text.health_bar_text.innerHTML = "Health: " + health;
  }

  static onSubmitName() {
    // let name = Text.player_name.value;
    //NetworkPlayerHandler.setName(name);
  }
}

class TextBox {
  constructor(x, y, text) {
    this.x = x;
    this.y = y;
    this.text = text;
  }

  draw() {}
}
