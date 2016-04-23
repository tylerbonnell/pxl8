// An example of an animation object
var anim = {
  "frames": [[["", "black", ""],
              ["black", "black", "black"],
              ["", "black", ""]],
             [["black", "", "black"],
              ["", "black", ""],
              ["black", "", "black"]]]
};

// A minified version of the above animation object
var anim_min={"frames":[[["","black",""],["black","black","black"],["","black",""]],[["black","","black"],["","black",""],["black","","black"]]]};


var canvas;
var colorPicker;
var mouseDown;
$(document).ready(function() {
  document.onmousedown = function() { mouseDown = true; }
  document.onmouseup = function() { mouseDown = false; }

  // Display Canvas
  canvas = new PixelCanvas(40, 40, 5, $("#PixelBox"), 0, "#30a5ff", function(px) {
    px.onclick = function() {
      console.log($("#cp1").data('colorpicker').color.toHex());
    }
    px.ondragstart = function() { return false; }
    px.ondrop = function() { return false; }
    px.onmouseenter = function() {
      if (mouseDown) {
        this.style.backgroundColor = $("#cp1").data('colorpicker').color.toHex();
      }
      this.style.boxShadow = "0 0 1px black inset";
    }
    px.onmouseleave= function() {
      this.style.boxShadow = "none";
    }
  });
  canvas.canvas.style.cursor = "none";
  canvas.add(anim);
  canvas.add(anim, 10, 5);
  canvas.add(anim_min, 5, 10);
  canvas.start();

  $("#cp1").colorpicker({
    format: "hex"
  });
});