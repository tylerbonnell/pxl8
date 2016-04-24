// An example minified JSON animation object
var anim_min={frames:[[["","black",""],["black","black","black"],["","black",""]],[["black","","black"],["","black",""],["black","","black"]]]};


var canvas;
var frames = [];
var currentFrame = 0;
var mouseDown;
$(document).ready(function() {
  document.onmousedown = function() { mouseDown = true; }
  document.onmouseup = function() { mouseDown = false; }

  var width = 40, height = 40, pxSize = 5;

  // Display Canvas
  canvas = new PixelCanvas(width, height, pxSize, $("#PixelBox"), 0, "#fff", function(px) {
    px.onmousedown = function() {
      colorPixel(this, true);
    }
    px.onmouseenter = function() {
      this.style.boxShadow = "0 0 1px black inset";
      colorPixel(this);
    }
    px.onmouseleave= function() {
      this.style.boxShadow = "none";
    }
  });

  canvas.hideCursor();
  canvas.canvas.style.border = "1px solid #eee"
  canvas.canvas.style.width = parseInt(canvas.canvas.style.width) + 2 + "px";
  canvas.start();

  $("#cp1").colorpicker({
    format: "hex"
  });

  $("#resizeButt").click(function() {
    var newW = $("#wBox").val();
    var newH = $("#hBox").val();
    var newPx = $("#pxBox").val();
    console.log(newW + "  " + newH + "  " + newPx);
    canvas.resize(newW, newH, newPx);
    canvas.canvas.style.width = parseInt(canvas.canvas.style.width) + 2 + "px";
  });

  $("#genButt").click(saveCurrentFrame());

  setInterval(function() {
    $("#loadButt").attr("disabled", $("#json-area").val() == "");
  }, 100);
});

function colorPixel(px, ignoreMouseDown) {
  if (mouseDown || ignoreMouseDown) {
    px.style.backgroundColor = $("#cp1").data('colorpicker').color.toHex();
  }
}

function saveCurrentFrame() {
  var frame = [];
  for (var r = 0; r < canvas.height; r++) {
    frame[r] = [];
    for (var c = 0; c < canvas.width; c++) {
      var color = $("#" + canvas.idAtCoords(c, r)).css("background-color");
      frame[r][c] = color == "rgba(0, 0, 0, 0)" ? "" : color;
    }
  }
  frames[currentFrame] = frame;
}