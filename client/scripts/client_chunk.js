class Chunk {
  constructor(world, x, y) {
    this.world = world;
    this.chunk_coord_x = Math.floor(x);
    this.chunk_coord_y = Math.floor(y);

    this.block_data = null;

    this.mesh = new Mesh();

    this.vertices = [];
    this.indices = [];
    this.texture_coords = [];
    this.vertex_index = 0;
  }

  createMeshData() {
    for (let x = 0; x < this.world.chunk_size; x++) {
      for (let y = 0; y < this.world.chunk_size; y++) {
        let id = this.block_data[x * this.world.chunk_size + y];

        let block = Block.getBlockFromName(id);
        if (block != null) {
          if (block.is_renderable) this.createFace(block, x, y);
        }
      }
    }
  }

  createMesh() {
    this.mesh.createMesh(
      this.vertices,
      this.indices,
      this.texture_coords,
      0,
      false
    );
    this.mesh.texture_id = this.world.texture_id;
  }
  clean() {
    this.vertices = [];
    this.indices = [];
    this.texture_coords = [];
    this.vertex_index = 0;
    this.mesh.cleanUp();
  }

  createFace(block, x, y) {
    this.vertices.push(x + 0);
    this.vertices.push(y + 0);
    this.vertices.push(x + 0);
    this.vertices.push(y + 1);
    this.vertices.push(x + 1);
    this.vertices.push(y + 0);
    this.vertices.push(x + 1);
    this.vertices.push(y + 1);

    this.indices.push(this.vertex_index + 0);
    this.indices.push(this.vertex_index + 1);
    this.indices.push(this.vertex_index + 2);
    this.indices.push(this.vertex_index + 2);
    this.indices.push(this.vertex_index + 1);
    this.indices.push(this.vertex_index + 3);
    this.vertex_index += 4;

    let texture_size = 16 / 256;
    let startX = texture_size * block.texture_x;
    let startY = texture_size * block.texture_y;
    let size_of_texture = 0.98;

    this.texture_coords.push(startX + texture_size * size_of_texture);
    this.texture_coords.push(startY + texture_size * size_of_texture);

    this.texture_coords.push(startX + texture_size * size_of_texture);
    this.texture_coords.push(startY);

    this.texture_coords.push(startX);
    this.texture_coords.push(startY + texture_size * size_of_texture);

    this.texture_coords.push(startX);
    this.texture_coords.push(startY);
  }

  draw() {
    gl.uniformMatrix4fv(
      Shaders.defaultShader_transformationMatrixLocation,
      false,
      this.createTransformationMatrix()
    );

    this.mesh.draw();
  }

  cleanUp() {
    this.mesh.cleanUp();
  }

  createTransformationMatrix() {
    let matrix = mat4.create();
    mat4.translate(matrix, matrix, [
      this.chunk_coord_x * this.world.chunk_size,
      this.chunk_coord_y * this.world.chunk_size,
      -0.8
    ]);
    return matrix;
  }
}
