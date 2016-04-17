// Constructor for a pixel canvas object
function PixelCanvas(width, height, pxSize, dom) {
  var box = document.createElement("div");
  for (var i = 0; i < height; i++) {
    var row = document.createElement("div");
    row.style.float = "left";
    row.style.clear = "left";
    for (var j = 0; j < width; j++) {
      var pixel = document.createElement("div");
      pixel.style.width = pixel.style.height = pxSize + "px";
      pixel.style.float = "left";
      pixel.style.backgroundColor = "cornflowerblue";
      pixel.id = "_" + i + "_" + j;
      row.appendChild(pixel);
    }
    box.appendChild(row);
  }
  box.id = "PixelCanvas";
  dom.appendChild(box);
}