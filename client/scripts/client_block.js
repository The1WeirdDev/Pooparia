class Block {
  static blocks = [];
  static amount_of_blocks = 0;

  static getBlockFromId(i) {
    if (i >= 0 && i < Block.amount_of_blocks) return Block.blocks[i];
    else {
      return Block.Air;
    }
  }

  static getBlockFromName(_name) {
    for (let i = 0; i < Block.amount_of_blocks; i++) {
      if (Block.blocks[i].name === _name) return Block.blocks[i];
    }

    return Block.Air;
  }

  constructor(name, texture_x, texture_y, can_collide, is_renderable) {
    this.name = name;
    this.texture_x = texture_x;
    this.texture_y = texture_y;
    this.can_collide = can_collide;
    this.is_renderable = is_renderable;

    this.take_damage_if_inside = false;
    this.prevents_fall_damage = false;

    this.is_liquid = false;

    this.liquid_resistance = 0.75;
    this.damage = 0;

    this.block_id = Block.amount_of_blocks;
    Block.amount_of_blocks = Block.amount_of_blocks + 1;
    Block.blocks.push(this);
  }

  static init() {
    //Blocks
    Block.Air = new Block("air", 0, 0, false, false);
    Block.Grass = new Block("grass", 0, 0, true, true);
    Block.Dirt = new Block("dirt", 1, 0, true, true);
    Block.Stone = new Block("stone", 5, 0, true, true);
    Block.Sand = new Block("sand", 0, 7, true, true);
    Block.Sand_Stone = new Block("sand_stone", 4, 0, true, true);

    Block.Wood = new Block("wood", 2, 0, false, true);
    Block.Leaves = new Block("leaves", 3, 0, false, true);

    Block.SnowyGrass = new Block("snowy_grass", 3, 2, true, true);
    Block.Snow = new Block("snow", 2, 2, true, true);

    Block.Cactus = new Block("cactus", 1, 7, false, true);

    Block.SnowyWood = new Block("snowy_wood", 5, 2, false, true);
    Block.SnowLeaves = new Block("snowy_leaves", 4, 2, false, true);

    Block.Coal_Ore = new Block("coal_ore", 0, 9, true, true);
    Block.Iron_Ore = new Block("iron_ore", 7, 0, true, true);

    Block.Stone_Brick = new Block("stone_brick", 10, 0, true, true);
    Block.Red_Brick = new Block("red_brick", 11, 0, true, true);
    Block.Gravel = new Block("gravel", 8, 0, true, true);

    Block.Cobblestone = new Block("cobble_stone", 0, 1, true, true);
    Block.Obsidian = new Block("obsidian", 1, 1, true, true);

    Block.Ice_1 = new Block("ice_1", 0, 2, true, true);
    Block.Ice_2 = new Block("ice_2", 1, 2, true, true);

    Block.Water = new Block("water", 6, 0, false, true);
    Block.Lava = new Block("lava", 0, 3, false, true);

    Block.Tnt = new Block("tnt", 0, 6, true, true);

    //Setting Options

    Block.Lava.damage = 12.5;
    Block.Cactus.damage = 2;

    Block.Lava.liquid_resistance = 0.5;
    Block.Lava.take_damage_if_inside = true;
    Block.Cactus.take_damage_if_inside = true;
    Block.Water.prevents_fall_damage = true;

    Block.Lava.is_liquid = true;
    Block.Water.is_liquid = true;
  }
}
