// An example of an animation object
var anim = {
  "frames": [[["", "black", ""],
              ["black", "black", "black"],
              ["", "black", ""]],
             [["black", "", "black"],
              ["", "black", ""],
              ["black", "", "black"]]]
};

var anim_min={"frames":[[["","black",""],["black","black","black"],["","black",""]],[["black","","black"],["","black",""],["black","","black"]]]};


var canvas;
var colorPicker;
$(document).ready(function() {
  // Display Canvas
  canvas = new PixelCanvas(40, 40, 5, $("#PixelBox"), 1000 / 3, "#30a5ff", function(px) {
    px.onmouseenter = function() {
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