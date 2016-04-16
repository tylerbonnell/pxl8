var HEIGHT = 50;
var WIDTH = 50;
var PX = 5;

window.onload = function() {
  generateGrid();
};

function generateGrid() {
  for (var i = 0; i < HEIGHT; i++) {
    var row = document.createElement("div");
    row.style.float = "left";
    row.style.clear = "left";
    for (var j = 0; j < WIDTH; j++) {
      // arr[i][j] = 1;
      var pixel = document.createElement("div");
      pixel.style.width = pixel.style.height = PX + "px";
      pixel.style.float = "left";
      pixel.style.backgroundColor = "white";
      pixel.id = "_" + i + "_" + j;
      row.appendChild(pixel);
    }
    $("body").appendChild(row);
  }
}

function $(el) {
  return document.querySelector(el);
}