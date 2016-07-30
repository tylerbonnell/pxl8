const CANVAS_WIDTH = 10;
const CANVAS_HEIGHT = 10;

var mouseDown;
var paintbrushColor;
var frames;
var currentFrame = 0;

window.onload = function() {
  window.onmousedown = function() { mouseDown = true; };
  window.onmouseup = function() { mouseDown = false; };

  $("color-save").onclick = function() {
    paintbrushColor = saveColor();
  };
  paintbrushColor = saveColor();

  generateCanvas($("canvas"));

  frames = [getPixels()];

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

function loadString(str) {
  prefab = JSON.parse(str);
  for (let frame in prefab.c) {
    frames[frame] = prefab.c[frame];
    for (let color in prefab.c[frame]) {
      if (frames > 0) continue;

      let pixels = prefab.c[frame][color];
      console.log(color);
      for (let i = 0; i < pixels.length; i += 2) {
        let pxl = $(`pxl-${pixels[i]}-${pixels[i + 1]}`);
        pxl.style.backgroundColor = color;
      }
    }
  }
}

function saveCurrentFrame() {
  frames[currentFrame] = getPixels();
}

function saveString() {
  var result = {};
  result.w = CANVAS_WIDTH;
  result.h = CANVAS_HEIGHT;
  result.c = [];

  for (let frame in frames) {
    let colorMap = {};
    let pixels = frames[frame];
    for (let i in pixels) {
      colorMap[pixels[i].b] = colorMap[pixels[i].b] || [];
      colorMap[pixels[i].b].push(pixels[i].r);
      colorMap[pixels[i].b].push(pixels[i].c);
    }
    result.c.push(colorMap);
  }

  return JSON.stringify(result);
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