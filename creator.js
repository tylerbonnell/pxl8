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
  canvas = new PixelCanvas(40, 40, 5, $("#PixelBox"), 1000 / 3, "cornflowerblue");
  canvas.add(anim);
  canvas.add(anim, 10, 5);
  canvas.add(anim_min, 5, 10);
  canvas.start();

  // Color Picker Canvas
  colorPicker = new PixelCanvas(64, 64, 3.125, $("#ColorPicker"), 0, "black", function(px) {
    px.style.backgroundColor = "lightgreen";
  });
  colorPicker.add(anim_min, 5, 10);
  colorPicker.start();
});