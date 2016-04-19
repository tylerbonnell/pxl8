/*
  Constructor for a pixel canvas object
  Parameters: width/height of canvas in pixels, size of pixels
  (in pixels, how meta), and the DOM object to append the
  PixelCanvas to. Optionally, can pass a pixelFunction that takes
  a pixel object as a parameter and applies that function to
  each pixel. (Use this for setting listeners on each pixel).
*/
function PixelCanvas(width, height, pxSize, dom, framerate, backgroundColor, pixelFunction) {

  // Initialize fields
  this.width = width;
  this.height = height;
  this.clips = {};

  this.update = function() {
    var pxs = {};
    for (var cl in this.clips) {
      var fr = cl["frames"][this.clips[cl]["frame"]];  // get the frame to draw
      /* do some shit here */
    }
  }

  this.redraw = function() {
    var arr = [];
    for (var i = 0; i < this.height; i++) {
      arr[i] = [];
      for (var j = 0; j < this.width; j++) {
        arr[i][j] = backgroundColor;
      }
    }
    for (var cl in this.clips) {
      var clipPts = this.getClipPts(cl);
      for (var i = 0; i < clipPts.length; i++) {
        arr[clipPts["row"]][clipPts["col"]] = clipPts["color"];
      }
    }
    for (var i = 0; i < this.height; i++) {
      for (var j = 0; j < this.width; j++) {
        document.getElementById("px_" + i + "_" + j).style.color = arr[i][j];
      }
    }
  }

  this.getClipPts = function(clip) {
    var result = [];
    if (this.clips[clip]) {
      var clipW = clip["frames"][0][0].length;
      var clipH = clip["frames"][0].length;
      for (var i = 0; i < clipW; i++) {
        for (var j = 0; j < clipH; j++) {
          result[i * clipW + j] =
              {"row": j, "col": i, "color": clip["frames"][this.clips[clip]["frame"]][j][i]};
        }
      }
    }
    return result;
  }

  // Every framerate ms, advance all clips & redraw the canvas
  this.start = function() {
    if (framerate > 0 && !this.drawTimer) {
      this.drawTimer = setInterval(function() {
        console.log("draw");
        for (var cl in this.clips) {
          this.clips[cl]["frame"] = (this.clips[cl]["frame"] + 1) % cl["frames"].length;
        }
      }, framerate);
    }
  }

  this.start();

  // Stop the timer that is currently going
  this.stop = function() {
    if (this.drawTimer) {
      clearInterval(this.drawTimer);
      this.drawTimer = null;
    }
  }


  // Add a new clip to the canvas
  this.add = function(clip, row, col) {
    this.clips[clip] = {"row": row, "col": col, "frame": 0};
  }

  this.translate = function(clip, rowDelta, colDelta) {
    if (this.clips[clip]) {
      this.clips[clip]["row"] += rowDelta;
      this.clips[clip]["col"] += colDelta;
    }
  }

  this.set = function(clip, row, col) {
    if (this.clips[clip]) {
      this.clips[clip]["row"] = row;
      this.clips[clip]["col"] = col;
    }
  }

  // ======================================================

  // Generate the DOM object
  var box = document.createElement("div");
  for (var i = 0; i < height; i++) {
    var row = document.createElement("div");
    row.style.float = "left";
    row.style.clear = "left";
    for (var j = 0; j < width; j++) {
      var pixel = document.createElement("div");
      pixel.style.width = pixel.style.height = pxSize + "px";
      pixel.style.float = "left";
      pixel.style.backgroundColor = backgroundColor;
      pixel.id = "px_" + i + "_" + j;
      row.appendChild(pixel);
      if (pixelFunction) {
        pixelFunction(pixel);
      }
    }
    row.id = "row_" + i;
    box.appendChild(row);
  }
  box.id = "PixelCanvas";
  dom.appendChild(box);


  this.redraw();
}