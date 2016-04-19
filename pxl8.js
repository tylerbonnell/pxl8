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

  /*
    This array contains all the elements that will be rendered on
    the canvas. It can be directly manipulated by the client, if
    they wish. redraw() must be called in order for changes to appear
    on the canvas.
  */
  this.clips = [];

  this.update = function() {

  }

  // Redraws all the pixels, based on the clips[] array.
  this.redraw = function() {
    var arr = [];
    for (var i = 0; i < this.height; i++) {
      arr[i] = [];
      for (var j = 0; j < this.width; j++) {
        arr[i][j] = backgroundColor;
      }
    }
    for (var i = 0; i < this.clips.length; i++) {
      var pts = this.clips[i].getClipPts();
      for (var j = 0; j < pts.length; j++) {
        if (pts[j]["row"] >= 0 && pts[j]["row"] < this.width &&
            pts[j]["col"] >= 0 && pts[j]["col"] < this.height) {
          arr[pts[j]["row"]][pts[j]["col"]] = pts[j]["color"];
        }
      }
    }
    for (var i = 0; i < this.height; i++) {
      for (var j = 0; j < this.width; j++) {
        document.getElementById("px_" + i + "_" + j).style.backgroundColor = arr[i][j];
      }
    }
  }

  // Every framerate ms, advance all clips & redraw the canvas
  this.start = function() {
    if (framerate > 0 && !this.drawTimer) {
      var canv = this;
      this.drawTimer = setInterval(function() {
        for (var i = 0; i < canv.clips.length; i++) {
          canv.clips[i].nextFrame();
        }
        canv.redraw();
      }, framerate);
    }
    this.redraw();
  }

  // Stop the timer that is currently going
  this.stop = function() {
    if (this.drawTimer) {
      clearInterval(this.drawTimer);
      this.drawTimer = null;
    }
  }


  // Add a new clip to the canvas, return the Animation object
  this.add = function(clip, row, col) {
    row = row || 0;
    col = col || 0;
    var anim = new Animation(clip, row, col);
    this.clips.push(anim);
    return anim;
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

}


/*
  Constructor for an Animation object
  Shouldn't be constructed directly, but is returned when add()
  is called on a PixelCanvas. Has operations with which the user
  can manipulate it.
*/
function Animation(anim, row, col) {
  this.anim = anim;
  this.row = row;
  this.col = col;
  this.frame = 0;
  this.width = anim["frames"][0][0].length;
  this.height = anim["frames"][0].length;

  this.getClipPts = function(clip) {
    var result = [];
    for (var i = 0; i < this.width; i++) {
      for (var j = 0; j < this.height; j++) {
        result[i * this.width + j] = {"row": j + this.row, "col": i + this.col,
            "color": this.anim["frames"][this.frame][j][i]};
      }
    }
    return result;
  }

  // Advances to the next frame of the animation
  // cycles to the beginning when it passes the end
  this.nextFrame = function() {
    this.frame = (this.frame + 1) % anim["frames"].length;
  }

  // Translates the object on the canvas
  this.translate = function(rowDelta, colDelta) {
    this.row += rowDelta;
    this.col += colDelta;
  }

  // Sets the position on the canvas
  this.set = function(row, col) {
    this.row = row;
    this.col = col;
  }
}


