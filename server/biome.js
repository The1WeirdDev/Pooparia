module.exports = class Biome {
  constructor(
    name,
    offset,
    scale,
    terrainHeight,
    terrainScale,
    surfaceBlock,
    subSurfaceBlock,
    undergroundBlock,
    can_generate_trees = true
  ) {
    this.name = name;
    this.offset = offset;
    this.scale = scale;

    this.terrainHeight = terrainHeight;
    this.terrainScale = terrainScale;

    this.surfaceBlock = surfaceBlock;
    this.subSurfaceBlock = subSurfaceBlock;
    this.undergroundBlock = undergroundBlock;

    this.dirt_height = 0;
    this.dirt_depth = 15;

    this.can_generate_trees = can_generate_trees;
  }
};
