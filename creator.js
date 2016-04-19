// An example of an animation object
var anim = {
  "frames": [[["white", "black", "white"],
              ["black", "black", "black"],
              ["white", "black", "white"]]]
};


var canvas;
window.onload = function() {
  canvas = new PixelCanvas(40, 40, 5, $("body"), 100000, "cornflowerblue", function(px) {
    px.onclick = function() {
      this.style.backgroundColor = "red";
    };
  });
  canvas.add(anim);
  canvas.start();
};

function $(el) {
  return document.querySelector(el);
}