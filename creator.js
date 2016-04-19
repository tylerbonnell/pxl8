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
window.onload = function() {
  canvas = new PixelCanvas(40, 40, 5, $("body"), 1000 / 3, "cornflowerblue", function(px) {
    px.onclick = function() {
      this.style.backgroundColor = "red";
    };
  });

  canvas.add(anim);
  canvas.add(anim, 10, 5);
  canvas.add(anim_min, 5, 10);
  canvas.start();
};

function $(el) {
  return document.querySelector(el);
}