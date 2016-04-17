window.onload = function() {
  var canvas = new PixelCanvas(10, 10, 30, $("body"), function(px) {
    px.onclick = function() {
      this.style.backgroundColor = "red";
    };
  });
};

function $(el) {
  return document.querySelector(el);
}