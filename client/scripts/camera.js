class Camera {
  constructor(player_model) {
    this.player_model = player_model;
    this.size = 32;

    this.clipX = 0;
    this.clipY = 0;
    this.lineNdx = 0;
  }

  update() {}

  getMouseWorldPos() {
    let p = new Vec2(
      this.player_model.position.x + this.clipX,
      this.player_model.position.y + this.clipY
    );

    return p;
  }

  updateMousePos(e) {
    const canvas = gl.canvas;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let _x = (x / rect.width) * 2 - 1;
    let _y = (y / rect.height) * -2 + 1;
    this.clipX = _x * this.size;
    this.clipY = _y * (this.size / 2);
  }

  createViewMatrix() {
    let matrix = mat4.create();
    glMatrix.mat4.translate(matrix, matrix, [
      -this.player_model.position.x,
      -this.player_model.position.y,
      0
    ]);
    return matrix;
  }

  createTransformationMatrix() {
    let matrix = mat4.create();
    glMatrix.mat4.translate(matrix, matrix, [
      this.player_model.position.x,
      this.player_model.position.y,
      -0.09
    ]);

    return matrix;
  }
}
