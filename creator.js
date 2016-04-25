// An example minified JSON animation object
var tamagotchi = {"w":40,"h":40,"f":{"rgb(0, 0, 0)":[[12,9,12,10,12,11,12,12,12,13,12,14,13,8,13,15,14,5,14,6,14,7,14,9,14,13,14,16,15,4,15,16,16,5,16,6,16,7,16,16,17,4,17,16,18,5,18,6,18,7,18,16,19,7,19,12,19,14,19,16,20,7,20,12,20,14,20,17,21,7,21,13,21,17,22,8,22,16,23,9,23,11,23,12,23,13,23,15,24,9,24,11,24,13,24,15,25,10,25,14]]}};

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

  $("#genButt").click(function() {
    saveCurrentFrame();
    $("#json-area").val(parseResult());
  });

  $("#json-area").focus(function(){
    // Select input field contents
    this.select();
  });

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

/*
  parseResult creates a compressed output string for users
  to use in their code. The function creates an object with
  the following properties:
    w: the width of the canvas
    h: the height of the canvas
    f: a map from colors to a 2d array where the outermost array
       represents the frame, and each internal array is an even
       series of ints representing row,col,row,col for each point
       which is equal to the color it is mapped to.
  parseResult returns the JSON.stringified version of that object :)
  users don't really need to worry about the format at all,
  they just paste it in and it's handled by pxl8.js
*/
function parseResult() {
  var map = {};
  for (var f = 0; f < frames.length; f++) {
    for (var i = 0; i < canvas.height; i++) {
      for (var j = 0; j < canvas.width; j++) {
        if (frames[f][i][j] != "") {
          if (!(frames[f][i][j] in map)) {
            map[frames[f][i][j]] = [];
          }
          if (!map[frames[f][i][j]][f]) {
            map[frames[f][i][j]][f] = [];
          }
          map[frames[f][i][j]][f].push(i);
          map[frames[f][i][j]][f].push(j);
        }
      }
    }
  }
  return JSON.stringify({w:canvas.width,h:canvas.height,f:map});
}
