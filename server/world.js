let SimplexNoise = require("simplex-noise");
let Utils = require("./utils");
let fs = require("fs");

let Chunk = require("./chunk");
let Biome = require("./biome");
let Block = require("./block");
let Vec2 = require("./vec2");
let Lode = require("./lode");

let savesFolder = "saves/world";
let currentSaveFile = "main";
let saveExtension = ".pws";

var world_save = Utils.createLogger(
  savesFolder,
  currentSaveFile,
  saveExtension
);

module.exports = class World {
  static chunks = [];

  constructor() {
    this.init();
  }

  init() {
    this.baseHeight = 50;

    this.seed = Math.floor(Math.random(0.0, 1.0) * 10000);
    this.simplex = new SimplexNoise(this.seed);

    //Biomes
    this.biomes = [];
    let groundBiome = new Biome(
      "grass",
      1234,
      0.2,
      40,
      0.3,
      Block.Grass,
      Block.Dirt,
      Block.Stone
    );

    let sandBiome = new Biome(
      "desert",
      5624,
      0.4,
      40,
      0.15,
      Block.Sand,
      Block.Sand_Stone,
      Block.Stone
    );

    let mountainBiome = new Biome(
      "mountains",
      1400,
      0.2,
      80,
      0.79,
      Block.Grass,
      Block.Dirt,
      Block.Stone
    );

    let snowyBiome = new Biome(
      "snowy",
      570,
      0.11,
      80,
      0.2,
      Block.SnowyGrass,
      Block.Dirt,
      Block.Stone
    );

    let waterBiome = new Biome(
      "water",
      570,
      0.05,
      40,
      0.01,
      Block.Water,
      Block.Dirt,
      Block.Stone,
      false
    );

    waterBiome.dirt_height = 4;

    this.biomes.push(groundBiome);
    this.biomes.push(sandBiome);
    this.biomes.push(mountainBiome);
    this.biomes.push(snowyBiome);
    this.biomes.push(waterBiome);

    //Lodes
    this.lodes = [];
    let air = new Lode("air", "air", 60, 0.09, 0.4, 1534);
    let gravel = new Lode("gravel", "gravel", 60, 0.05, 0.45, 1534);

    let coal_ore = new Lode("coal_ore", "coal_ore", 60, 0.01, 0.5, 1534);
    let iron_ore = new Lode("iron_ore", "iron_ore", 60, 0.01, 0.5, 1534);

    this.lodes.push(air);
    this.lodes.push(gravel);
    this.lodes.push(coal_ore);
    this.lodes.push(iron_ore);
  }

  loadSaveFile() {}

  save() {}

  getChunk(_x, _y) {
    let x = Math.floor(_x);
    let y = Math.floor(_y);

    let c = null;
    for (let i = 0; i < World.chunks.length; i++) {
      let chunk = World.chunks[i];

      if (chunk.chunk_coord_x === x && chunk.chunk_coord_y === y) {
        c = chunk;
        break;
      }
    }

    if (c != null) {
      return c;
    } else {
      return this.createChunk(x, y);
    }
  }

  setBlock(socket, x, y, id) {
    let _x = x;
    let _y = y;
    let _id = id;

    let px = Math.floor(_x / Chunk.chunk_size);
    let py = Math.floor(_y / Chunk.chunk_size);

    let chunk = this.getChunk(px, py);
    if (chunk != null) {
      let bx = _x - chunk.global_chunk_coord_x;
      let by = _y - chunk.global_chunk_coord_y;

      let p = bx * Chunk.chunk_size + by;

      if (chunk.block_data[p] != _id) {
        //Setting Blocks Around tnt to destroy
        chunk.block_data[p] = _id;

        let _data = {
          x: _x,
          y: _y,
          id: _id
        };

        socket.broadcast.emit("set_block", _data);
        socket.emit("set_block", _data);
      }
    }
  }

  createChunk(x, y) {
    let chunk = new Chunk(this, x, y);

    chunk.createBlocks();
    World.chunks.push(chunk);
    return chunk;
  }

  clamp(v, min, max) {
    if (v < min) return min;
    else if (v > max) return max;
    else return v;
  }

  getNoise(x, y) {
    let perlin = this.simplex.noise2D(
      x / (Chunk.chunk_size * 4),
      y / (Chunk.chunk_size * 4)
    );

    let mperlin = perlin;
    if (mperlin < 0) mperlin *= -1;

    return mperlin;
  }

  get2dPerlin(position, offset, scale) {
    let p = this.simplex.noise2D(
      ((position.x + 0.1) / (Chunk.chunk_size * 4)) * scale + offset,
      ((position.y + 0.1) / (Chunk.chunk_size * 4)) * scale + offset
    );

    if (p < 0) p *= -1;

    return p;
  }

  islodeperlin(position, offset, scale, threshold) {
    let p = this.simplex.noise2D(
      ((position.x + 0.1) / Chunk.chunk_size) * scale + offset,
      ((position.y + 0.1) / Chunk.chunk_size) * scale + offset
    );

    if (p > threshold) return true;
    else return false;
  }

  getBiome(x) {
    //Biomes
    let sumOfHeights = 0.0;
    let count = 0;
    let strongestWeight = 0.0;
    let strongestBiomeIndex = 0;

    for (let i = 0; i < this.biomes.length; i++) {
      let weight = this.get2dPerlin(
        new Vec2(x, 0),
        this.biomes[i].offset,
        this.biomes[i].scale
      );

      // Keep track of which weight is strongest.
      if (weight > strongestWeight) {
        strongestWeight = weight;
        strongestBiomeIndex = i;
      }
    }

    // Set biome to the one with the strongest weight.
    let biome = this.biomes[strongestBiomeIndex];
    return biome;
  }

  getHeight(x) {
    //Biomes
    let sumOfHeights = 0.0;
    let count = 0;
    let strongestWeight = 0.0;
    let strongestBiomeIndex = 0;

    for (let i = 0; i < this.biomes.length; i++) {
      let weight = this.get2dPerlin(
        new Vec2(x, 0),
        this.biomes[i].offset,
        this.biomes[i].scale
      );

      // Keep track of which weight is strongest.
      if (weight > strongestWeight) {
        strongestWeight = weight;
        strongestBiomeIndex = i;
      }
      // Get the height of the terrain (for the current biome) and multiply it by its weight.
      let height =
        this.biomes[i].terrainHeight *
        this.get2dPerlin(new Vec2(x, 0), 0, this.biomes[i].terrainScale) *
        weight;

      // If the height value is greater 0 add it to the sum of heights.
      if (height > 0) {
        sumOfHeights += height;
        count++;
      }
    }

    // Set biome to the one with the strongest weight.
    let _biome = this.biomes[strongestBiomeIndex];
    // Get the average of the heights.

    let t = sumOfHeights / count;
    sumOfHeights = t;

    let terrainHeight = Math.floor(sumOfHeights + this.baseHeight);
    if (
      terrainHeight < this.baseHeight ||
      terrainHeight === NaN ||
      terrainHeight === isNaN
    )
      terrainHeight = this.baseHeight;
    return terrainHeight;
  }

  getHeightAndBiome(x) {
    //Biomes
    let sumOfHeights = 0.0;
    let count = 0;
    let strongestWeight = 0.0;
    let strongestBiomeIndex = 0;

    for (let i = 0; i < this.biomes.length; i++) {
      let weight = this.get2dPerlin(
        new Vec2(x, 0),
        this.biomes[i].offset,
        this.biomes[i].scale
      );

      // Keep track of which weight is strongest.
      if (weight > strongestWeight) {
        strongestWeight = weight;
        strongestBiomeIndex = i;
      }
      // Get the height of the terrain (for the current biome) and multiply it by its weight.
      let height =
        this.biomes[i].terrainHeight *
        this.get2dPerlin(new Vec2(x, 0), 0, this.biomes[i].terrainScale) *
        weight;

      // If the height value is greater 0 add it to the sum of heights.
      if (height > 0) {
        sumOfHeights += height;
        count++;
      }
    }

    // Set biome to the one with the strongest weight.
    let _biome = this.biomes[strongestBiomeIndex];
    // Get the average of the heights.

    let t = sumOfHeights / count;
    sumOfHeights = t;

    let terrainHeight = Math.floor(sumOfHeights + this.baseHeight);
    if (
      terrainHeight < this.baseHeight ||
      terrainHeight === NaN ||
      isNaN(terrainHeight)
    )
      terrainHeight = this.baseHeight;

    return { biome: _biome, height: terrainHeight };
  }
};
