class World {
  static chunks = [];
  static chunks_to_create = [];
  static chunks_to_render = [];
  static chunks_currently_recieving = [];
  static is_getting_chunk = false;
  static spawn_position_y = 0;

  init() {
    this.seed = null;
    this.chunk_size = null;
    this.loaded_server_data = false;
    this.texture_id = loadTexture(gl, "texture-packs/blocks/main.png");

    Networking.getWorldData();
  }

  generateChunk(x, y, data) {
    let chunk = new Chunk(this, x, y);
    chunk.block_data = data;
    chunk.createMeshData();
    chunk.createMesh();
    World.chunks.push(chunk);

    World.is_getting_chunk = false;
    World.chunks_currently_recieving.shift();

    return chunk;
  }

  createChunk(_x, _y) {
    let shouldAdd = true;

    for (let i = 0; i < World.chunks_to_create.length; i++) {
      let c = World.chunks_to_create[i];
      if (c.x === _x && c.y === _y) shouldAdd = false;
    }

    if (shouldAdd) {
      World.chunks_to_create.push({ x: _x, y: _y });
    }
  }

  getChunk(_x, _y, createIfNull = true) {
    _x = Math.floor(_x);
    _y = Math.floor(_y);

    let c = null;
    for (let i = 0; i < World.chunks.length; i++) {
      let chunk = World.chunks[i];

      if (chunk.chunk_coord_x === _x && chunk.chunk_coord_y === _y) {
        c = chunk;
        break;
      }
    }

    if (c == null && createIfNull) this.createChunk(_x, _y);

    return c;
  }
  getBlock(_x, _y) {
    _x = Math.floor(_x);
    _y = Math.floor(_y);

    let px = Math.floor(_x / this.chunk_size);
    let py = Math.floor(_y / this.chunk_size);

    let chunk = this.getChunk(px, py, false);

    if (chunk != null) {
      let bx = _x - px * this.chunk_size;
      let by = _y - py * this.chunk_size;

      let pos = bx * this.chunk_size + by;
      let id = chunk.block_data[pos];

      return id;
    } else return "air";
  }

  setBlock(_x, _y, id, shouldEmit = true) {
    _x = Math.floor(_x);
    _y = Math.floor(_y);

    let px = Math.floor(_x / this.chunk_size);
    let py = Math.floor(_y / this.chunk_size);

    let chunk = this.getChunk(px, py, false);

    if (chunk != null) {
      let bx = _x - px * this.chunk_size;
      let by = _y - py * this.chunk_size;

      let pos = bx * this.chunk_size + by;
      chunk.block_data[pos] = id;
      chunk.clean();
      chunk.createMeshData();
      chunk.createMesh();
    }
    if (shouldEmit) {
      Networking.setBlock(_x, _y, id);
    }
  }

  setChunkData(chunk, data) {
    chunk.block_data = data;
    chunk.clean();
    chunk.createMeshData();
    chunk.createMesh();
  }
  createChunksWaiting() {
    if (World.chunks_to_create.length > 0) {
      let pc = World.chunks_to_create[0];
      let shouldRecieve = true;

      //Checking if a chunk is already created
      for (let i = 0; i < World.chunks.length; i++) {
        let c = World.chunks[i];
        if (
          c.chunk_coord_x === Math.floor(pc.x) &&
          c.chunk_coord_y === Math.floor(pc.y)
        ) {
          shouldRecieve = false;
          World.chunks_to_create.shift();
        }
      }

      //Checking if that chunk is currently being received
      for (let i = 0; i < World.chunks_currently_recieving.length; i++) {
        let c = World.chunks_currently_recieving[i];
        if (c.x === pc.x && c.y === pc.y) {
          shouldRecieve = false;
          World.chunks_to_create.shift();
        }
      }

      if (World.is_getting_chunk === false && shouldRecieve) {
        Networking.createChunk(this, pc.x, pc.y);

        World.chunks_currently_recieving.push({ x: pc.x, y: pc.y });
        World.chunks_to_create.shift();
      }
    }
  }

  update() {
    if (this.loaded_server_data === false) return;

    for (let i = 0; i < 10; i++) {
      this.createChunksWaiting();
    }

    World.chunks_to_render = [];

    let px = Math.floor(player.player_model.position.x / this.chunk_size);
    let py = Math.floor(player.player_model.position.y / this.chunk_size);
    let distance = player.view_distance / 2;
    for (let cx = px - distance; cx < px + distance; cx++) {
      for (let cy = py - distance; cy < py + distance; cy++) {
        let chunk = this.getChunk(cx, cy);
        if (chunk === null) {
          this.createChunk(cx, cy);
        } else {
          World.chunks_to_render.push(chunk);
        }
      }
    }
  }
  draw() {
    Shaders.default_shader.start();

    for (let i = 0; i < World.chunks_to_render.length; i++) {
      World.chunks_to_render[i].draw();
    }

    Shaders.default_shader.stop();
  }

  cleanUp() {
    for (let i = 0; i < World.chunks.length; i++) {
      World.chunks[i].cleanUp();
    }
  }
}
