let simplex_noise = require("simplex-noise");
let Structure = require("./structure");
let Block = require("./block");

module.exports = class Structures {
  static isValidStructure(biome, simplex, chunk, px, py, height) {
    let is_valid = false;

    let floraZoneScale = 1.3;

    let floraZoneThreshold = 0.2;
    let floraPlacementScale = 15;
    let floraPlacementThreshold = 0.8;

    let p1 = simplex.noise2D(px, floraZoneScale);
    let p2 = simplex.noise2D(px, floraPlacementScale);

    if (p1 < 0) p1 *= -1;
    if (p2 < 0) p2 *= -1;

    if (p1 > floraZoneThreshold) {
      if (p2 > floraPlacementThreshold) {
        if (py === height) {
          if (biome.can_generate_trees) {
            is_valid = true;

            if (biome.name != "desert") {
              let bark_height = 5;
              let width = 3;
              let height = 4;

              let wood = Block.Wood;
              let leaves = Block.Leaves;

              if (biome.name == "snowy") {
                wood = Block.SnowyWood;
                leaves = Block.SnowyLeaves;
              }

              for (let i = 0; i < bark_height; i++) {
                chunk.addBlockToQue(px, py + i, wood);
              }

              for (let x = -width + 1; x < width; x++) {
                for (let y = 0; y < height; y++) {
                  chunk.addBlockToQue(px + x, py + y + bark_height, leaves);
                }
              }

              for (let x = -width + 2; x < width - 1; x++) {
                for (let y = 0; y < 1; y++) {
                  chunk.addBlockToQue(
                    px + x,
                    py + y + bark_height + height,
                    leaves
                  );
                }
              }
            } else {
              let height = 2;
              for (let i = 0; i < height; i++) {
                chunk.addBlockToQue(px, py + i, Block.Cactus);
              }
            }
          }
        }
      }
    }

    return is_valid;
  }
};
