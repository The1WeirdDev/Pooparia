module.exports = class Lode {
  constructor(nodeName, blockID, maxHeight, scale, threshold, noiseOffset) {
    this.nodeName = nodeName;
    this.blockID = blockID;
    this.maxHeight = maxHeight;
    this.scale = scale;
    this.threshold = threshold;
    this.noiseOffset = noiseOffset;
  }
};
