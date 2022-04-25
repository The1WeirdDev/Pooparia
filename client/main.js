const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl2", {
  premultipliedAlpha: true,
  antialias: false
});

canvas.oncontextmenu = function (e) {
  e.preventDefault();
};

if (!gl) {
  alert("Webgl Not Supported. Cannot start game.");
}

function fullscreen() {
  if (canvas.webkitRequestFullScreen) {
    canvas.webkitRequestFullScreen();
  } else {
    canvas.mozRequestFullScreen();
  }
}

window.onload = Start;
window.onbeforeunload = CleanUp;

let screen_start_menu = new StartMenuScreen();
let screen_world = new WorldScreen();

//alert(document.cookie);
let world = new World();
let player = new Player();

document.addEventListener("keydown", function (event) {
  if (event.keyCode === 122) {
    fullscreen();
  } else {
    Screen.onKeyDown(event);
  }
});
document.addEventListener("keyup", function (event) {
  Screen.onKeyUp(event);
});
gl.canvas.addEventListener("mousedown", (e) => {
  player.onMouseDown(e);
});

gl.canvas.addEventListener("mouseup", (e) => {
  player.onMouseUp(e);
});
gl.canvas.addEventListener("mousemove", (e) => {
  if (player.camera != null) player.camera.updateMousePos(e);
});

let inited = false;

function Start() {
  Init();
  inited = true;
  setInterval(Update, 1000 / 60);
  Draw();
}
function Init() {
  Time.init();
  Shaders.Init();
  Screen.init();
}
function Update() {
  Screen.update();
  //Draw();
}
function Draw() {
  if (inited) {
    Display.prepareDisplay();
    Screen.draw();

    Display.postUpdateDisplay();
  }
  window.requestAnimationFrame(Draw);
}
function CleanUp() {
  Screen.cleanUp();

  Shaders.CleanUp();
}
