// Constructor for a pixel canvas object
function PixelCanvas(width, height, pxSize, dom) {
  var box = document.createElement("div");
  for (var i = 0; i < height; i++) {
    var row = document.createElement("div");
    row.style.float = "left";
    row.style.clear = "left";
    row.style.height = pxSize;
    for (var j = 0; j < width; j++) {
      var pixel = document.createElement("div");
      pixel.style.width = pxSize;
      pixel.style.height = "100%";
      pixel.style.float = "left";
      pixel.style.backgroundColor = "white";
      pixel.id = "_" + i + "_" + j;
      row.appendChild(pixel);
    }
    box.appendChild(row);
  }
  dom.appendChild(box);
}