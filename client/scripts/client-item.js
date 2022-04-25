class Item {
  constructor(name) {
    this.init(name);
  }

  init(name, shouldmakemesh = true, tx = 0, ty = 0) {
    this.item_name = name;
    this.mesh = new Mesh();
    this.should_draw = true;

    if (shouldmakemesh) {
      //Mesh
      let texture_size = 16 / 256;
      let startX = texture_size * tx;
      let startY = texture_size * ty;
      let size_of_texture = 0.98;

      this.createMesh(
        [0, 0, 0, 1, 1, 0, 1, 1],
        [0, 1, 2, 2, 1, 3],
        [
          startX + texture_size * size_of_texture,
          startY + texture_size * size_of_texture,
          startX + texture_size * size_of_texture,
          startY,
          startX,
          startY + texture_size * size_of_texture,
          startX,
          startY
        ],
        loadTexture(gl, "texture-packs/items/main.png")
      );
    }
  }

  onUse() {}
  onStopUse() {}

  createMesh(vertices, indices, texture_coords, texture_id) {
    this.mesh.createMesh(vertices, indices, texture_coords, 0, false);
    this.mesh.texture_id = texture_id;
  }

  update() {}

  draw() {
    if (this.should_draw === false) return;
    Shaders.ui_shader.start();

    gl.uniformMatrix4fv(
      Shaders.uiShader_projectionMatrixLocation,
      false,
      Shaders.projectionMatrix //player.camera.createViewMatrix()
    );

    gl.uniformMatrix4fv(
      Shaders.uiShader_transformationMatrixLocation,
      false,
      mat4.create() //player.camera.createViewMatrix()
    );

    this.mesh.draw();

    Shaders.ui_shader.stop();
  }

  cleanUp() {
    this.mesh.cleanUp();
  }
}

class ItemBlock extends Item {
  constructor(name, block) {
    super(name, false, 0, 0);

    this.block = block;

    let texture_size = 16 / 256;
    let startX = texture_size * block.texture_x;
    let startY = texture_size * block.texture_y;
    let size_of_texture = 0.98;

    this.createMesh(
      [0, 0, 0, 1, 1, 0, 1, 1],
      [0, 1, 2, 2, 1, 3],
      [
        startX + texture_size * size_of_texture,
        startY + texture_size * size_of_texture,
        startX + texture_size * size_of_texture,
        startY,
        startX,
        startY + texture_size * size_of_texture,
        startX,
        startY
      ],
      world.texture_id
    );

    this.should_draw = false;
  }

  onUse() {
    let pos = player.camera.getMouseWorldPos();
    player.inventory.placeBlock(pos, this.block.name);
  }
  onStopUse() {}
}

class ItemHealer extends Item {
  constructor(name, x, y, heal_value, delay) {
    super(name, true, x, y);
    this.heal_value = heal_value;
    this.delay = delay;

    this.last_time = Time.getElapsedTime();
  }

  onUse() {
    let time = Time.getElapsedTime();
    if (time - this.last_time >= this.delay) {
      player.increaseHealth(this.heal_value);

      this.last_time = time;
    }
  }
}
