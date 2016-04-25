// An example minified JSON animation object
var tamagotchi = {"f":{"rgb(0, 0, 0)":["11,8,11,9,11,10,11,11,11,12,12,7,12,13,13,4,13,5,13,6,13,8,13,12,13,14,14,3,14,15,15,4,15,5,15,6,15,15,16,3,16,15,17,4,17,5,17,6,17,15,18,6,18,11,18,13,18,16,19,6,19,11,19,13,19,16,20,6,20,12,20,16,21,7,21,15,22,8,22,10,22,11,22,12,22,14,23,8,23,10,23,12,23,14,24,9,24,13,"]},"w":40,"h":40};

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
            map[frames[f][i][j]][f] = "";
          }
          map[frames[f][i][j]][f] += i + "," + j + ",";
        }
      }
    }
  }
  return JSON.stringify({w:canvas.width,h:canvas.height,f:map});
}

// Returns a compressed string representation of an array
/*function shortArr(arr) {
  if (arr.length == 0) return "[]";
  var result = "[" + arr[0];
  var startSeq = arr[0];
  var seqLength = 1;
  for (var i = 1; i < arr.length; i++) {
    if (arr[i] == startSeq) {
      seqLength++;
    } else {
      if (seqLength > 1) {
        result += "×" + seqLength;
      }
      result += "," + arr[i];
      startSeq = arr[i];
      seqLength = 1;
    }
  }
  if (seqLength > 1) {
    result += "×" + seqLength;
  }
  return result + "]";
}*/


