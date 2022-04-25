class Networking {
  static server_socket = null;
  static server_address = null;
  static is_connected = false;
  static latency = 0;

  static ConnectToServer(address, username) {
    Networking.server_address = address;

    Networking.server_socket = io(address, {
      transports: ["polling", "websockets"]
    });

    Networking.server_socket.on("connect", Networking.onConnect);
    Networking.server_socket.on("disconnect", Networking.onDisconnect);
    Networking.server_socket.on("set_block", Networking.onSetBlock);

    Networking.server_socket.on(
      "set_players",
      NetworkPlayerHandler.onSetPlayers
    );
    Networking.server_socket.on("add_player", NetworkPlayerHandler.onAddPlayer);
    Networking.server_socket.on(
      "remove_player",
      NetworkPlayerHandler.onRemovePlayer
    );
    Networking.server_socket.on(
      "set_player_pos",
      NetworkPlayerHandler.onSetPlayerPos
    );

    Networking.server_socket.on(
      "on_send_message",
      PlayerMessageHandler.onMessage
    );

    Networking.server_socket.on(
      "set_chunk_data",
      PlayerMessageHandler.onSetChunkData
    );
    Networking.server_socket.on("set-health", NetworkPlayerHandler.onSetHealth);

    Networking.server_socket.emit("set_player_username", username);

    NetworkPlayerHandler.cleanUp();
    NetworkPlayerHandler.Players = [];
  }

  static disconnect() {
    if (Networking.is_connected) {
      Networking.server_socket.disconnect();
      Networking.is_connected = false;
    }
  }

  //Calls to get the on functions called
  static getPlayers() {
    Networking.server_socket.emit("get_players");
  }

  static onConnect() {
    console.log("Connected to server");
    console.log(Networking.server_socket.id);

    Networking.is_connected = true;

    Networking.getPlayers();
  }
  static onDisconnect() {
    console.log("Disconnected from server");
    window.location.reload();
  }

  static onSetBlock(data) {
    world.setBlock(data.x, data.y, data.id, false);
  }

  static getWorldData() {
    Networking.server_socket.emit("get_world_data", function (data) {
      world.chunk_size = data.chunk_size;
      world.seed = data.seed;
      world.loaded_server_data = true;
      player.player_model.position.y = data.start_position_y;
      World.start_position_y = data.start_position_y;
    });
  }

  static createChunk(world, _x, _y) {
    Networking.server_socket.emit("get_chunk_data", { x: _x, y: _y }, function (
      data
    ) {
      world.generateChunk(_x, _y, data);
    });
  }

  static setBlock(_x, _y, _id) {
    Networking.server_socket.emit("set_block", { x: _x, y: _y, id: _id });
  }

  static onSetChunkData(_x, _y, _data) {
    let chunk = world.getChunk(_x, _y);

    if (chunk != null) {
      world.setChunkData(chunk, _data);
    }
  }
}
