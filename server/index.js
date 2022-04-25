const express = require("express");
const fs = require("fs");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.get("*", (req, res) => {
  let newUrl = req.url;
  if (newUrl.startsWith("/")) newUrl = newUrl.slice(1);
  if (newUrl === "") newUrl = "client/index.html";

  const headers = { "Content-Type": "text/html" };
  fs.readFile(newUrl, function (error, data) {
    if (error) {
      res.writeHead(404, headers);
      res.write("<html><h1>error 404 page not found</h1></html>");
    } else {
      res.writeHead(200, headers);
      res.write(data);
    }
    res.end();
  });
});

server.listen(8080, () => {
  console.log("Server is Running");
});

let World = require("./world");
let Chunk = require("./chunk");

let world = new World();
let players = [];

world.loadSaveFile();

var minutes = 30,
  the_interval = minutes * 60 * 1000;
setInterval(function () {
  console.log("Auto saving");
  world.save();
}, the_interval);

io.on("connection", (socket) => {
  console.log("User Connected : " + socket.id);

  //Setting To Object
  let player = {
    id: socket.id,
    name: null,
    is_dead: false,
    health: 100,
    generated_mesh: false, //Only changes for client side
    position: { x: 0, y: world.getHeight(0) }
  };

  //Adding Player to the list
  players.push(player);
  socket.broadcast.emit("add_player", { ...player });

  socket.on("disconnect", () => {
    console.log("User Disconnected : " + socket.id);
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === socket.id) {
        //Tell the other players that a person connected
        socket.broadcast.emit("on_send_message", {
          name: "Server",
          message: players[i].name + " has left"
        });
        socket.broadcast.emit("remove_player", players[i]);
        players.splice(i);
        break;
      }
    }
  });

  socket.on("set-health", (data) => {
    for (let i = 0; i < players.length; i++) {
      if (players[i].id === socket.id) {
        if (players[i].name != null) {
          if (data !== isNaN) {
            players[i].health = data;

            if (players[i].health <= 0) {
              players[i].is_dead = true;
              socket.emit("on_send_message", {
                name: "Server",
                message: players[i].name + " has died"
              });
              socket.broadcast.emit("on_send_message", {
                name: "Server",
                message: players[i].name + " has died"
              });
            } else {
              players[i].is_dead = false;
            }

            socket.broadcast.emit("set-health", {
              player: players[i]
            });
            break;
          }
        }
      }
    }
  });

  socket.on("send_message", (data) => {
    for (let i = 0; i < players.length; i++) {
      if (players[i].id == socket.id) {
        socket.broadcast.emit("on_send_message", {
          name: players[i].name,
          message: data
        });
        break;
      }
    }
  });

  socket.on("get_players", () => {
    socket.emit("set_players", Array.from(players));
  });

  socket.on("set_player_username", (name) => {
    for (let i = 0; i < players.length; i++) {
      if (players[i].id == socket.id) {
        players[i].name = name;

        //Tell the other players that a person connected
        socket.broadcast.emit("on_send_message", {
          name: "Server",
          message: name + " has joined"
        });

        break;
      }
    }
  });
  socket.on("set_player_pos", (data) => {
    for (let i = 0; i < players.length; i++) {
      let player = players[i];
      let x = data.x;
      let y = data.y;

      player.position.x = data.x;
      player.position.y = data.y;

      if (player.id === socket.id) {
        socket.broadcast.emit("set_player_pos", { ...player });
      }
    }
  });

  //Game

  socket.on("get_world_data", (fun) => {
    let world_data = {
      seed: world.seed,
      chunk_size: Chunk.chunk_size,
      start_position_y: world.getHeight(0)
    };
    fun(world_data);
  });
  socket.on("get_chunk_data", (pos, fun) => {
    let chunk = world.getChunk(pos.x, pos.y);

    fun(chunk.block_data);
  });

  socket.on("set_block", (data) => {
    let x = Math.floor(data.x);
    let y = Math.floor(data.y);
    let id = data.id;
    world.setBlock(socket, x, y, id);
  });
});
