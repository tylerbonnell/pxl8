/*
  This is a very hacky editor which is being used simply for the
  creation of the pxl8 library. Once that is built, will revisit
  this and make it better.
*/

const CANVAS_WIDTH = 40;
const CANVAS_HEIGHT = 30;

var mouseDown;
var paintbrushColor;
var prefab = {f: [{}]};
/*
  Shape of prefab:
  {
    f: [
      {
        "rgb(0, 0, 0, 0)": [row, col, row, col, row, col, ...],
        ...
      },
      ...
    ]
  }
*/
var currentFrame = 0;

/*
  TOOLS
*/
const PAINT = "paint";
const ERASE = "erase";

var tool = PAINT;

window.onload = function() {
  window.onmousedown = function() { mouseDown = true; };
  window.onmouseup = function() { mouseDown = false; };

  paintbrushColor = saveColor();
  $("color-set-color").onclick = function() {
    paintbrushColor = saveColor();
  };
  $("tool-paint").onclick = function() { tool = PAINT };
  $("tool-erase").onclick = function() { tool = ERASE };
  $("color-left-move").onclick = moveFrameLeft;
  $("color-left").onclick = prevFrame;
  $("color-right-move").onclick = moveFrameRight;
  $("color-right").onclick = nextFrame;
  $("color-del").onclick = function() {
    if (prefab.f.length == 1) {
      prefab.f[currentFrame] = {};
    } else if (currentFrame > 0) {
      prevFrame();
      prefab.f.splice(currentFrame + 1, 1);
      nextFrame();
    } else {
      prefab.f.splice(0, 1);
      loadPrefab();
    }
    loadPrefab();
  };
  $("color-add").onclick = function() {
    prefab.f.splice(currentFrame + 1, 0, {});
    nextFrame();
  };
  $("color-export").onclick = function() {
    saveCurrentFrame();
    console.log(saveString());
  };
  $("color-clear").onclick = function() {
    prefab.f[currentFrame] = {};
    loadPrefab();
  };

  generateCanvas($("canvas"));
}

// CONTROLS
function nextFrame(omitSave) {
  if (currentFrame == prefab.f.length - 1) return;
  if (omitSave != true)
    saveCurrentFrame();
  currentFrame++;
  loadPrefab();
}
function prevFrame(omitSave) {
  if (currentFrame == 0) return;
  if (omitSave != true)
    saveCurrentFrame();
  currentFrame--;
  loadPrefab();
}
function moveFrameRight() {
  if (currentFrame == prefab.f.length - 1) return;
  var x = prefab.f[currentFrame];
  prefab.f[currentFrame] = prefab.f[currentFrame + 1];
  prefab.f[currentFrame + 1] = x;
  nextFrame(true);
}
function moveFrameLeft() {
  if (currentFrame == 0) return;
  var x = prefab.f[currentFrame];
  prefab.f[currentFrame] = prefab.f[currentFrame - 1];
  prefab.f[currentFrame - 1] = x;
  prevFrame(true);
}

function clearFrame() {
  for (var row = 0; row < CANVAS_HEIGHT; row++) {
    for (var col = 0; col < CANVAS_WIDTH; col++) {
      let pxl = $(`pxl-${row}-${col}`);
      pxl.style.backgroundColor = "";
    }
  }
}

function loadString(str) {
  prefab = JSON.parse(str);
  loadPrefab();
}

function loadPrefab() {
  clearFrame();
  for (let color in prefab.f[currentFrame]) {
    let pixels = prefab.f[currentFrame][color];
    for (let i = 0; i < pixels.length; i += 2) {
      let pxl = $(`pxl-${pixels[i]}-${pixels[i + 1]}`);
      pxl.style.backgroundColor = color;
    }
  }
  $("color-frame").innerHTML = `${currentFrame + 1}/${prefab.f.length}`;
}

function saveCurrentFrame() {
  let colorMap = {};
  let pixels = getPixels();
  for (let i in pixels) {
    colorMap[pixels[i].b] = colorMap[pixels[i].b] || [];
    colorMap[pixels[i].b].push(pixels[i].r);
    colorMap[pixels[i].b].push(pixels[i].c);
  }
  prefab.f[currentFrame] = colorMap;
}

function saveString() {
  prefab.w = CANVAS_WIDTH;
  prefab.h = CANVAS_HEIGHT;
  return JSON.stringify(prefab);
}

function getPixels() {
  var pixels = [];
  for (var row = 0; row < CANVAS_HEIGHT; row++) {
    for (var col = 0; col < CANVAS_WIDTH; col++) {
      let pxl = $(`pxl-${row}-${col}`);
      if (pxl.style.backgroundColor) {
        pixels.push({
          b: pxl.style.backgroundColor,
          r: row,
          c: col
        })
      }
    }
  }
  return pixels;
}

function generateCanvas(canvasDiv) {
  var result = "";
  for (var row = 0; row < CANVAS_HEIGHT; row++) {
    result += "<div class=\"pxl-row\">";
    for (var col = 0; col < CANVAS_WIDTH; col++) {
      result += `<div class=\"pxl\" id=\"pxl-${row}-${col}\"></div>`;
    }
    result += "</div>";
  }
  canvasDiv.innerHTML = result;

  var pixels = $("canvas").querySelectorAll(".pxl");
  for (let i in pixels) {
    let p = pixels[i];
    p.onmouseover = function() {
      if (mouseDown) {
        clickPixel(this);
      }
    }
    p.onmousedown = function() {
      mouseDown = true;
      clickPixel(this);
    }
  }
}

function clickPixel(pixel) {
  if (tool == PAINT) {
    pixel.style.backgroundColor = paintbrushColor;
  } else if (tool == ERASE) {
    pixel.style.backgroundColor = "";
  }
}

function saveColor() {
  var r = parseInt($("color-r").value) || 0;
  var g = parseInt($("color-g").value) || 0;
  var b = parseInt($("color-b").value) || 0;
  return `rgb(${r}, ${g}, ${b})`;
}

function $(el) {
  return document.getElementById(el);
}