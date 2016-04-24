// An example of an animation object
var anim = {
  frames: [[["", "black", ""],
              ["black", "black", "black"],
              ["", "black", ""]],
             [["black", "", "black"],
              ["", "black", ""],
              ["black", "", "black"]]]
};

// A minified version of the above animation object
var anim_min={frames:[[["","black",""],["black","black","black"],["","black",""]],[["black","","black"],["","black",""],["black","","black"]]]};


var canvas;
var colorPicker;
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
});

function colorPixel(px, ignoreMouseDown) {
  if (mouseDown || ignoreMouseDown) {
    px.style.backgroundColor = $("#cp1").data('colorpicker').color.toHex();
  }
}