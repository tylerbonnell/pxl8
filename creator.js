window.onload = function() {
  var canvas = new PixelCanvas(50, 50, "5px", $("#grid"));
};

function $(el) {
  return document.querySelector(el);
}