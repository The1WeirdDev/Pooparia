let Structures = require("./structures");
let Utils = require("./utils");
let Block = require("./block");
let Vec2 = require("./vec2");

module.exports = class Chunk {
  static chunk_size = 45;
  constructor(world, x, y) {
    this.world = world;
    this.chunk_coord_x = x;
    this.chunk_coord_y = y;

    this.global_chunk_coord_x = this.chunk_coord_x * Chunk.chunk_size;
    this.global_chunk_coord_y = this.chunk_coord_y * Chunk.chunk_size;

    this.block_que = [];
    this.block_data = new Array(Chunk.chunk_size * Chunk.chunk_size).fill(0);
    this.first_generated = true;
  }

  createBlocks() {
    let cx = this.global_chunk_coord_x;
    let cy = this.global_chunk_coord_y;

    for (let x = 0; x < Chunk.chunk_size; x++) {
      let height = this.world.getHeight(cx + x);

      for (let y = 0; y < Chunk.chunk_size; y++) {
        this.block_data[x * Chunk.chunk_size + y] = this.getBlockId(
          x,
          y,
          height
        );
      }
    }

    this.setBlocksInQue();
  }

  getBlock(x, y) {
    return this.block_data[x * Chunk.chunk_size + y];
  }

  setBlock(x, y, id) {
    this.block_data[x * Chunk.chunk_size + y] = id;
  }

  setBlocksInQue() {
    for (let i = this.block_que.length - 1; i >= 0; i--) {
      let block = this.block_que[i];
      this.block_data[block.x * Chunk.chunk_size + block.y] = block.id;

      this.block_que.pop();
    }
  }

  addBlockToQue(_x, _y, _id, is_outside_of_chunk = false) {
    _x = Math.floor(_x) - this.chunk_coord_x * Chunk.chunk_size;
    _y = Math.floor(_y) - this.chunk_coord_y * Chunk.chunk_size;
    if (_x < 0 || _y < 0 || _x >= Chunk.chunk_size || _y >= Chunk.chunk_size) {
    }
    this.block_que.push({ x: _x, y: _y, id: _id });
  }

  getBlockId(_x, _y, _h) {
    let x = _x + this.global_chunk_coord_x;
    let y = _y + this.global_chunk_coord_y;
    let id = 0;

    let bah = this.world.getHeightAndBiome(x);
    let biome = bah.biome;
    let terrainHeight = bah.height;

    let structureBlock = false;
    if (this.getBlock(_x, _y - 1) !== 0)
      structureBlock = Structures.isValidStructure(
        bah.biome,
        this.world.simplex,
        this,
        x,
        y,
        terrainHeight
      );
    if (!structureBlock) {
      if (
        y <= terrainHeight - 1 &&
        y >= terrainHeight - (biome.dirt_height + 1)
      ) {
        id = biome.surfaceBlock;
      } else if (
        y < terrainHeight - (biome.dirt_height + 1) &&
        y >= terrainHeight - (biome.dirt_height + 1) - bah.biome.dirt_depth
      ) {
        id = biome.subSurfaceBlock;
      } else if (y < terrainHeight) {
        id = biome.undergroundBlock;
      } else {
        id = Block.Air;
      }
    }

    if (id == biome.undergroundBlock) {
      for (let i = 0; i < this.world.lodes.length; i++) {
        let lode = this.world.lodes[i];
        if (y < lode.maxHeight)
          if (
            this.world.islodeperlin(
              new Vec2(x, y),
              lode.noiseOffset,
              lode.scale,
              lode.threshold
            )
          ) {
            id = lode.blockID;
          }
      }
    }
    return id;
  }

  isCave(x, y) {
    let perlin = this.world.getNoise(x, y);

    let mperlin = perlin;
    if (mperlin < 0) mperlin *= -1;

    let t1 = false;
    let t2 = false;

    if (mperlin > 0.5) t1 = true;

    perlin = this.world.getNoise(y, x);

    mperlin = perlin;
    if (mperlin < 0) mperlin *= -1;

    if (mperlin > 0.5) t2 = true;
    return false;
  }
};
