window.onload = function() {
  var canvas = new PixelCanvas(40, 40, 5, $("body"), function(px) {
    px.onclick = function() {
      this.style.backgroundColor = "red";
    };
  });
};

function $(el) {
  return document.querySelector(el);
}