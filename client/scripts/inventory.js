class Inventory {
  constructor(player) {
    this.player = player;
    this.current_item = 1;
  }

  init() {
    let s = 1.5;
    let x = 0;
    let y = 0;

    let vertices = [x, y, x, y + s, x + s, y, x + s, y + s];
    let indices = [0, 1, 2, 2, 1, 3];
    let texture_coords = [1, 1, 1, 0, 0, 1, 0, 0];

    //Inventory Mesh
    this.mesh = new Mesh();
    this.mesh.createMesh(vertices, indices, texture_coords, 0, false);
    this.mesh.texture_id = loadTexture(gl, "ui/inventory.png");

    //Items
    this.items = [];

    for (let i = 0; i < Block.amount_of_blocks; i++) {
      this.addItem(new ItemBlock(Block.blocks[i].name, Block.blocks[i]));
    }

    this.addItem(new ItemHealer("medkit", 0, 0, 100, 11));

    this.shouldPlace = false;
    this.shouldBreak = false;
  }

  toggleBlock(v) {
    this.current_item += v;

    if (this.current_item >= this.items.length) this.current_item = 1;
    else if (this.current_item <= 0) this.current_item = this.items.length - 1;
  }

  addItem(item) {
    this.items.push(item);
  }

  onMousePress(button) {
    if (button == 0) {
      this.shouldPlace = true;
      this.shouldBreak = false;
    } else if (button == 2) {
      this.shouldPlace = false;
      this.shouldBreak = true;
    }
  }
  onMouseUnpress(button) {
    if (button == 0 && this.shouldPlace) {
      this.shouldPlace = false;
      this.shouldBreak = false;
    } else if (button == 2 && this.shouldBreak) {
      this.shouldPlace = false;
      this.shouldBreak = false;
    }
  }

  placeBlock(pos, name) {
    world.setBlock(Math.floor(pos.x), Math.floor(pos.y), name);
  }

  destroyBlock(pos) {
    world.setBlock(Math.floor(pos.x), Math.floor(pos.y), "air");
  }

  update() {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].update();
    }

    if (this.shouldPlace && !this.shouldBreak)
      this.items[this.current_item].onUse();
    else if (!this.shouldPlace && this.shouldBreak) this.items[0].onUse();
  }

  draw() {
    Shaders.ui_shader.start();

    gl.uniformMatrix4fv(
      Shaders.uiShader_projectionMatrixLocation,
      false,
      Shaders.projectionMatrix
    );

    let matrix = mat4.create();
    glMatrix.mat4.translate(matrix, matrix, [0, -12, 0]);

    gl.uniformMatrix4fv(
      Shaders.uiShader_transformationMatrixLocation,
      false,
      matrix
    );

    this.items[this.current_item].draw();

    Shaders.ui_shader.stop();
  }

  cleanUp() {
    for (let i = 0; i < this.items.length; i++) {
      this.items[i].cleanUp();
    }
    this.mesh.cleanUp();
  }
}
