// An example of an animation object
var anim = {
  "frames": [[["white", "black", "white"],
              ["black", "black", "black"],
              ["white", "black", "white"]]]
};



window.onload = function() {
  var canvas = new PixelCanvas(40, 40, 5, $("body"), 1000, "cornflowerblue", function(px) {
    px.onclick = function() {
      this.style.backgroundColor = "red";
    };
  });
};

function $(el) {
  return document.querySelector(el);
}