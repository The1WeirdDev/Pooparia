class Screen {
  static onKeyDown(event) {
    screen_start_menu.onKeyDown(event);
    screen_world.onKeyDown(event);
  }
  static onKeyUp(event) {
    screen_start_menu.onKeyUp(event);
    screen_world.onKeyUp(event);
  }

  static init() {
    screen_start_menu.init();
  }

  static update() {
    screen_start_menu.update();
    screen_world.update();
  }

  static draw() {
    screen_start_menu.draw();
    screen_world.draw();
  }

  static cleanUp() {
    screen_start_menu.cleanUp();
    screen_world.cleanUp();
  }
}

class StartMenuScreen {
  constructor() {
    this.should_update = false;
  }

  onKeyDown(event) {}
  onKeyUp(event) {}

  init() {
    Text.chatDiv.style.display = "none";
    Text.health_ui.style.display = "none";
  }

  update() {}

  draw() {}

  cleanUp() {}
}

class WorldScreen {
  constructor() {
    this.should_do_stuff = false;
  }

  onKeyDown(event) {
    if (this.should_do_stuff) player.onKeyDown(event);
  }
  onKeyUp(event) {
    if (this.should_do_stuff) player.onKeyUp(event);
  }

  init(user_name) {
    Networking.ConnectToServer(window.location.origin, user_name);

    Block.init();
    world.init();
    player.init(user_name);

    Text.init();
    this.should_do_stuff = true;
    Text.chatDiv.style.display = "inherit";
    Text.health_ui.style.display = "inherit";
  }

  update() {
    if (this.should_do_stuff == false) return;
    Time.updateTime();
    world.update();
    NetworkPlayerHandler.update();
    player.update();
    Text.update();
  }

  draw() {
    if (this.should_do_stuff == false) return;

    //The Actual Matrixes
    let camera_size = player.camera.size;

    mat4.ortho(
      Shaders.projectionMatrix,
      -camera_size,
      camera_size,
      -camera_size / 2,
      camera_size / 2,
      -1.0,
      1.0
    );

    Shaders.default_shader.start();

    gl.uniformMatrix4fv(
      Shaders.defaultShader_projectionMatrixLocation,
      false,
      Shaders.projectionMatrix
    );

    gl.uniformMatrix4fv(
      Shaders.defaultShader_viewMatrixLocation,
      false,
      player.camera.createViewMatrix()
    );

    Shaders.default_shader.stop();

    world.draw();
    NetworkPlayerHandler.draw();
    player.draw();
  }

  cleanUp() {
    world.cleanUp();
    NetworkPlayerHandler.cleanUp();
    player.cleanUp();
  }
}
