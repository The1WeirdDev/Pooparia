class NetworkPlayerHandler {
  static Players = [];

  static update() {}
  static draw() {
    Shaders.default_shader.start();

    for (let i = 0; i < NetworkPlayerHandler.Players.length; i++) {
      let player = NetworkPlayerHandler.Players[i];
      if (player != null) {
        if (player.generated_mesh) {
          if (player.id != Networking.server_socket.id) {
            if (player.position != null) {
              if (player.position.x != NaN && player.position.y != NaN) {
                gl.uniformMatrix4fv(
                  Shaders.defaultShader_transformationMatrixLocation,
                  false,
                  NetworkPlayerHandler.getPlayerTransformationMatrix(
                    player.position
                  )
                );
                player.mesh.draw();
              }
            }
          }
        } else {
          if (player != null) {
            if (player.generated_mesh == false)
              NetworkPlayerHandler.createMeshForPlayer(player);
          }
        }
      }
    }

    Shaders.default_shader.stop();
  }

  static setHealth(health) {
    Networking.server_socket.emit("set-health", health);
  }

  static onSetHealth(data) {
    let _player = data.player;
    let username = _player.name;
    let health = _player.health;
    let is_dead = _player.is_dead;

    for (let i = 0; i < NetworkPlayerHandler.Players.length; i++) {
      let player = NetworkPlayerHandler.Players[i];
      if (player != null) {
        if (player.id == _player.id) {
          player.health = _player.health;
          player.is_dead = _player.is_dead;
        }
      }
    }
  }

  static setName(_name) {
    Networking.server_socket.emit(
      "set_player_name",
      _name,
      (name, accepted) => {
        if (accepted) {
          console.log(name);
        }
      }
    );
  }

  static setPlayerPos(_x, _y) {
    Networking.server_socket.emit("set_player_pos", { x: _x, y: _y });
  }
  static onSetPlayerPos(data) {
    let sPlayer = data;
    let _p = null;

    for (let i = 0; i < NetworkPlayerHandler.Players.length; i++) {
      let _player = NetworkPlayerHandler.Players[i];

      if (_player.id === sPlayer.id) _p = _player;
    }

    if (_p != null) {
      _p.position.x = sPlayer.position.x;
      _p.position.y = sPlayer.position.y;
    } else {
      if (data.id !== Networking.server_socket.id) {
        NetworkPlayerHandler.addPlayer(data);
      }
    }
  }

  static onSetPlayers(server_players) {
    for (let i = 0; i < server_players.length; i++) {
      let _player = server_players[i];
      if (_player != null) {
        NetworkPlayerHandler.addPlayer(_player);
      }
    }
  }

  static addPlayer(data) {
    if (data.id != Networking.server_socket.id) {
      let shouldCreate = true;

      for (let i = 0; i < NetworkPlayerHandler.Players.length; i++) {
        if (NetworkPlayerHandler.Players[i].id == data.id) {
          shouldCreate = false;
        }
      }
      if (shouldCreate) {
        NetworkPlayerHandler.Players.push(data);
        NetworkPlayerHandler.createMeshForPlayer(
          NetworkPlayerHandler.Players[NetworkPlayerHandler.Players.length - 1]
        );
      }
    }
  }
  static onAddPlayer(data) {
    if (data != null) {
      NetworkPlayerHandler.addPlayer(data);
    }
  }
  static onRemovePlayer(data) {
    for (let i = 0; i < NetworkPlayerHandler.Players.length; i++) {
      let __player = NetworkPlayerHandler.Players[i];

      if (__player.id == data.id) {
        __player.mesh.cleanUp();
        NetworkPlayerHandler.Players.splice(i);
      }
    }
  }

  static cleanUp() {
    for (let i = 0; i < NetworkPlayerHandler.Players.length; i++) {
      let player = NetworkPlayerHandler.Players[i];

      if (player.mesh != null) {
        player.mesh.cleanUp();
      }
    }
  }

  static createMeshForPlayer(player) {
    if (player.generated_mesh == false) {
      let vertices = [0, 0, 0, 2, 0.8, 0, 0.8, 2];
      let indices = [0, 1, 2, 2, 1, 3];
      let texture_coords = [1, 1, 1, 0, 0, 1, 0, 0];

      player.mesh = new Mesh();
      player.mesh.createMesh(
        vertices,
        indices,
        texture_coords,
        "entities/player.png"
      );

      player.generated_mesh = true;
    }
  }
  static getPlayerTransformationMatrix(position) {
    let matrix = mat4.create();
    glMatrix.mat4.translate(matrix, matrix, [position.x, position.y, -0.5]);
    return matrix;
  }
}
