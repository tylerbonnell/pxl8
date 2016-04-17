window.onload = function() {
  var canvas = new PixelCanvas(50, 50, 5, $("body"));
};

function $(el) {
  return document.querySelector(el);
}