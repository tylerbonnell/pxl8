const CANVAS_WIDTH = 10;
const CANVAS_HEIGHT = 10;

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

window.onload = function() {
  window.onmousedown = function() { mouseDown = true; };
  window.onmouseup = function() { mouseDown = false; };

  paintbrushColor = saveColor();
  $("color-save").onclick = function() {
    paintbrushColor = saveColor();
  };
  $("color-left").onclick = prevFrame;
  $("color-right").onclick = nextFrame;
  $("color-del").onclick = function() {
    if (prefab.f.length == 1) {
      clearFrame();
      prefab.f[currentFrame] = {};
    } else {
      prevFrame();
      prefab.f.splice(currentFrame + 1, 1);
      nextFrame();
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

  generateCanvas($("canvas"));
}

// CONTROLS
function nextFrame() {
  if (currentFrame == prefab.f.length - 1) return;
  saveCurrentFrame();
  currentFrame++;
  $("color-frame").innerHTML = "" + currentFrame;
  loadPrefab();
}
function prevFrame() {
  if (currentFrame == 0) return;
  saveCurrentFrame();
  currentFrame--;
  $("color-frame").innerHTML = "" + currentFrame;
  loadPrefab();
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
        this.style.backgroundColor = paintbrushColor;
      }
    }
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