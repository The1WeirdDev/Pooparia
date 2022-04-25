class Player {
  init(name) {
    this.player_model = new PlayerModel(name);
    this.camera = new Camera(this.player_model);

    this.desired_pos = new Vec2(0, 0);
    this.last_pos = new Vec2(0, 0);
    this.view_distance = 4;

    this.last_death = 0;

    //Creating Player Mesh data
    let vertices = [0, 0, 0, 2, 0.8, 0, 0.8, 2];
    let indices = [0, 1, 2, 2, 1, 3];
    let texture_coords = [1, 1, 1, 0, 0, 1, 0, 0];

    //Player Mesh
    this.mesh = new Mesh();
    this.mesh.createMesh(
      vertices,
      indices,
      texture_coords,
      "entities/player.png"
    );

    vertices = [
      -this.camera.size,
      -this.camera.size / 2,
      -this.camera.size,
      this.camera.size / 2,
      this.camera.size,
      -this.camera.size / 2,
      this.camera.size,
      this.camera.size / 2
    ];

    this.skybox_mesh = new Mesh();
    this.skybox_mesh.createMesh(
      vertices,
      indices,
      texture_coords,
      "skybox/overworld.png"
    );

    //Inventory
    this.inventory = new Inventory(this);
    this.inventory.init();
  }

  onMouseDown(e) {
    if (this.inventory != null) this.inventory.onMousePress(e.button);
  }
  onMouseUp(e) {
    if (this.inventory != null) this.inventory.onMouseUnpress(e.button);
  }

  onKeyDown(event) {
    let keyCode = event.keyCode;

    if (Input.isUp(keyCode)) {
      this.desired_pos.y = 1;
    } else if (Input.isDown(keyCode)) {
      this.desired_pos.y = -1;
    }

    if (Input.isLeft(keyCode)) {
      this.desired_pos.x = -1;
    } else if (Input.isRight(keyCode)) {
      this.desired_pos.x = 1;
    }

    if (Input.isJump(keyCode)) {
      this.player_model.should_jump = true;
    }
  }

  onKeyUp(event) {
    let keyCode = event.keyCode;
    if (Input.isUp(keyCode) && this.desired_pos.y == 1) {
      this.desired_pos.y = 0;
    } else if (Input.isDown(keyCode) && this.desired_pos.y == -1) {
      this.desired_pos.y = 0;
    }

    if (keyCode == 69) this.inventory.toggleBlock(-1);
    if (keyCode == 82) this.inventory.toggleBlock(1);
    if (Input.isRight(keyCode) && this.desired_pos.x == 1) {
      this.desired_pos.x = 0;
    } else if (Input.isLeft(keyCode) && this.desired_pos.x == -1) {
      this.desired_pos.x = 0;
    }
  }

  checkCollision() {
    let shouldSendSocket = false;
    let tpx = this.desired_pos.x * this.player_model.speed * Time.deltaTime;

    if (tpx != 0) shouldSendSocket = true;

    let movement_test_1 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(this.player_model.position.x + tpx),
        Math.floor(this.player_model.position.y)
      )
    );

    let movement_test_2 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(
          this.player_model.position.x + this.player_model.player_width + tpx
        ),
        Math.floor(this.player_model.position.y)
      )
    );

    let movement_test_3 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(this.player_model.position.x + tpx),
        Math.floor(
          this.player_model.position.y + this.player_model.player_height - 1
        )
      )
    );

    let movement_test_4 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(
          this.player_model.position.x + this.player_model.player_width + tpx
        ),
        Math.floor(
          this.player_model.position.y + this.player_model.player_height - 1
        )
      )
    );

    let movement_test_5 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(this.player_model.position.x + tpx),
        Math.floor(
          this.player_model.position.y +
            this.player_model.player_height -
            this.player_model.y_check
        )
      )
    );

    let movement_test_6 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(
          this.player_model.position.x + this.player_model.player_width + tpx
        ),
        Math.floor(
          this.player_model.position.y +
            this.player_model.player_height -
            this.player_model.y_check
        )
      )
    );

    let isInsideDamagableBlock1 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(this.player_model.position.x),
        Math.floor(this.player_model.position.y)
      )
    );

    let isInsideDamagableBlock2 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(
          this.player_model.position.x + this.player_model.player_width
        ),
        Math.floor(this.player_model.position.y)
      )
    );

    let isInsideDamagableBlock3 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(this.player_model.position.x),
        Math.floor(this.player_model.position.y + 1)
      )
    );

    let isInsideDamagableBlock4 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(
          this.player_model.position.x + this.player_model.player_width
        ),
        Math.floor(this.player_model.position.y + 1)
      )
    );

    //Liquid Damage
    let damage = 0;
    if (isInsideDamagableBlock1.damage !== 0)
      damage = isInsideDamagableBlock4.damage;
    if (isInsideDamagableBlock2.damage !== 0)
      damage = isInsideDamagableBlock2.damage;
    if (isInsideDamagableBlock3.damage !== 0)
      damage = isInsideDamagableBlock3.damage;
    if (isInsideDamagableBlock4.damage !== 0)
      damage = isInsideDamagableBlock4.damage;

    if (
      isInsideDamagableBlock1.take_damage_if_inside ||
      isInsideDamagableBlock2.take_damage_if_inside ||
      isInsideDamagableBlock3.take_damage_if_inside ||
      isInsideDamagableBlock4.take_damage_if_inside
    ) {
      this.increaseHealth(-damage * Time.deltaTime);
    }

    //Liquid Resistance
    let resistance = 1;

    if (isInsideDamagableBlock1.is_liquid)
      resistance = isInsideDamagableBlock4.liquid_resistance;
    if (isInsideDamagableBlock2.is_liquid)
      resistance = isInsideDamagableBlock2.liquid_resistance;
    if (isInsideDamagableBlock3.is_liquid)
      resistance = isInsideDamagableBlock3.liquid_resistance;
    if (isInsideDamagableBlock4.is_liquid)
      resistance = isInsideDamagableBlock4.liquid_resistance;

    if (
      movement_test_1.can_collide === false &&
      movement_test_2.can_collide === false &&
      movement_test_3.can_collide === false &&
      movement_test_4.can_collide === false
    ) {
      this.player_model.position.x += tpx * resistance;
    } else {
    }

    let ground_check_1 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(this.player_model.position.x),
        Math.floor(this.player_model.position.y + this.player_model.y_check)
      )
    );

    let ground_check_2 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(
          this.player_model.position.x + this.player_model.player_width
        ),
        Math.floor(this.player_model.position.y + this.player_model.y_check)
      )
    );

    if (ground_check_1.can_collide || ground_check_2.can_collide) {
      this.takeFallDamage(this.player_model.velocity);
      this.player_model.velocity = 0;
      this.player_model.is_grounded = true;
      this.player_model.is_jumping = false;
    } else {
      this.player_model.is_grounded = false;
      this.player_model.velocity += this.player_model.gravity * Time.deltaTime;
    }

    if (this.player_model.should_jump) {
      if (this.player_model.is_jumping) {
        this.player_model.should_jump = false;
      } else {
        if (this.player_model.is_grounded) {
          this.player_model.velocity = Math.sqrt(
            this.player_model.jump_height * -2.0 * this.player_model.gravity
          );
        }

        this.player_model.should_jump = false;
      }
    }

    let testY =
      this.player_model.position.y +
      this.player_model.velocity * Time.deltaTime;

    let test_velocity_1 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(this.player_model.position.x),
        Math.floor(testY)
      )
    );

    let test_velocity_2 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(
          this.player_model.position.x + this.player_model.player_width
        ),
        Math.floor(testY)
      )
    );

    let test_velocity_3 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(this.player_model.position.x),
        Math.floor(testY + this.player_model.player_height)
      )
    );

    let test_velocity_4 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(
          this.player_model.position.x + this.player_model.player_width
        ),
        Math.floor(testY + this.player_model.player_height)
      )
    );

    let is_inside_block = Block.getBlockFromName(
      world.getBlock(
        Math.floor(this.player_model.position.x),
        Math.floor(this.player_model.position.y)
      )
    );

    if (is_inside_block.is_solid == true) {
      this.player_model.velocity = 0;
    }

    if (this.player_model.velocity > 0) {
      if (
        test_velocity_3.can_collide ||
        test_velocity_4.can_collide ||
        is_inside_block.can_collide
      ) {
        this.player_model.velocity = 0;
      }
    } else if (this.player_model.velocity < 0) {
      if (
        test_velocity_1.can_collide ||
        test_velocity_2.can_collide ||
        is_inside_block.can_collide
      ) {
        this.takeFallDamage(this.player_model.velocity);
        this.player_model.velocity = 0;
      }
    }

    if (this.player_model.velocity != 0) {
      let testBlock = Block.getBlockFromName(
        world.getBlock(
          Math.floor(this.player_model.position.x),
          Math.floor(
            this.player_model.position.y +
              this.player_model.velocity * Time.deltaTime
          )
        )
      );

      if (testBlock.can_collide == false) {
        shouldSendSocket = true;
        this.player_model.position.y +=
          this.player_model.velocity * resistance * Time.deltaTime;
      }
    }

    if (shouldSendSocket) {
      let _mx = this.player_model.position.x;
      let _my = this.player_model.position.y;
      NetworkPlayerHandler.setPlayerPos(_mx, _my);
    }
  }

  takeFallDamage(velocity) {
    let shouldPreventDamage1 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(
          this.player_model.position.x + this.player_model.player_width
        ),
        Math.floor(this.player_model.position.y)
      )
    );

    let shouldPreventDamage2 = Block.getBlockFromName(
      world.getBlock(
        Math.floor(this.player_model.position.x),
        Math.floor(this.player_model.position.y + 1)
      )
    );

    if (
      shouldPreventDamage1.prevents_fall_damage == false &&
      shouldPreventDamage2.prevents_fall_damage == false
    ) {
      if (velocity <= -25) {
        this.increaseHealth(velocity);
      }
    }
  }

  setHealth(value) {
    this.player_model.health = value;
    this.player_model.health = Utils.clamp(
      this.player_model.health,
      0,
      this.player_model.max_health
    );
    NetworkPlayerHandler.setHealth(this.player_model.health);
  }

  increaseHealth(value) {
    this.player_model.health += value;

    this.player_model.health = Utils.clamp(
      this.player_model.health,
      0,
      this.player_model.max_health
    );

    NetworkPlayerHandler.setHealth(this.player_model.health);
  }

  update() {
    if (!world.loaded_server_data) return;
    if (world.getChunk(0, 0) == null) return;

    this.checkCollision();

    if (Math.floor(this.player_model.health) <= 0) {
      this.onDeath();
    }

    if (Math.floor(this.player_model.health) < this.player_model.max_health) {
      this.increaseHealth(0.5 * Time.deltaTime);
    }
    this.camera.update();

    this.inventory.update();
  }

  onDeath() {
    let elapsed = Time.getElapsedTime();
    if (elapsed - this.last_death > 0.25) {
      this.player_model.position.x = 0;
      this.player_model.position.y = World.start_position_y;

      NetworkPlayerHandler.setPlayerPos(
        this.player_model.position.x,
        this.player_model.position.y
      );
      this.setHealth(this.player_model.max_health);

      this.last_death = elapsed;
    }
  }

  draw() {
    //Skybox
    Shaders.skybox_shader.start();
    gl.uniformMatrix4fv(
      Shaders.skybox_projectionMatrixLocation,
      false,
      Shaders.projectionMatrix
    );

    this.skybox_mesh.draw();
    Shaders.skybox_shader.stop();

    //Player Mesh
    Shaders.default_shader.start();
    gl.uniformMatrix4fv(
      Shaders.defaultShader_transformationMatrixLocation,
      false,
      this.camera.createTransformationMatrix()
    );
    this.mesh.draw();
    Shaders.default_shader.stop();

    this.inventory.draw();
  }

  cleanUp() {
    this.skybox_mesh.cleanUp();
    this.mesh.cleanUp();
    this.inventory.cleanUp();
  }
}
