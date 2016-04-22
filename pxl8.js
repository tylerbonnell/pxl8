var numOfCanvases = 0;

/*
  Constructor for a pixel canvas object
  Parameters: width/height of canvas in pixels, size of pixels
  (in pixels, how meta), and the DOM object to append the
  PixelCanvas to. Optionally, can pass a pixelFunction that takes
  a pixel object as a parameter and applies that function to
  each pixel. (Use this for setting listeners on each pixel).
*/
function PixelCanvas(width, height, pxSize, dom, framerate, backgroundColor, pixelFunction) {
  numOfCanvases++;
  this.num = numOfCanvases;

  // Initialize fields
  this.width = width;
  this.height = height;
  this.pixelFunction = pixelFunction;
  this.backgroundColor = backgroundColor;
  this.parentNode = dom;
  this.pxSize = pxSize;

  this.getPixelDOM = function(row, col) {
    return document.getElementById("c" + this.num + "_px_" + row + "_" + col);
  };

  /*
    This array contains all the elements that will be rendered on
    the canvas. It can be directly manipulated by the client, if
    they wish. redraw() must be called in order for changes to appear
    on the canvas.
  */
  this.clips = [];

  /*
    This dictionary maps keys (in the form c#_px_row_col eg c2_px_3_8)
    to colors that need to be updated.
  */
  this.updatePoints = {};

  // Marks all the points occupied by animation to be redrawn
  // If clear is true, sets all points it occupies to be empty
  this.updatePointsFor = function(animation, clear) {
    var pts = animation.getClipPts();
    for (var i = 0; i < pts.length; i++) {
      this.updatePoints["c" + this.num + "_px_" + pts[i]["row"] + "_" + pts[i]["col"]] =
          clear ? "" : pts[i]["color"];
    }
  }

  // Updates all the points that are occupied by animation clips
  this.updateAllClips = function() {
    for (var i = 0; i < this.clips.length; i++) {
      this.updatePointsFor(this.clips[i]);
    }
  }

  // Updates pixels that have changed (to make it so a pixel is considered
  // "changed", call updatePointsFor(clip) to register the current points
  this.update = function() {
    for (key in this.updatePoints) {
      document.getElementById(key).style.backgroundColor = this.updatePoints[key];
    }
  }

  // Redraws all the pixels, based on the clips[] array.
  // In general, update() should be used instead of this.
  this.redraw = function() {
    updatePoints = {};
    var arr = [];
    for (var i = 0; i < this.height; i++) {
      arr[i] = [];
      for (var j = 0; j < this.width; j++) {
        arr[i][j] = "";
        this.getPixelDOM(i, j).style.backgroundColor = arr[i][j];
      }
    }

    for (var i = 0; i < this.clips.length; i++) {
      var pts = this.clips[i].getClipPts();  // for each of the clips, get all the solid points
      for (var j = 0; j < pts.length; j++) {  // for each of those, update the div's color
        if (pts[j]["row"] >= 0 && pts[j]["row"] < this.width &&
            pts[j]["col"] >= 0 && pts[j]["col"] < this.height) {
          if (pts[j]["color"] != "" && pts[j]["color"] != null) {
            this.getPixelDOM(pts[j]["row"], pts[j]["col"]).style.backgroundColor = pts[j]["color"];
          }
        }
      }
    }
  }

  this.resize = function(newWidth, newHeight, newPixelSize) {
    this.width = newWidth;
    this.height = newHeight;
    this.generateDom();
  }

  // Every framerate ms, advance all clips & redraw the canvas
  this.start = function() {
    if (framerate > 0 && !this.drawTimer) {
      var canv = this;
      this.drawTimer = setInterval(function() {
        for (var i = 0; i < canv.clips.length; i++) {
          canv.clips[i].nextFrame();
        }
        canv.updateAllClips();
        canv.update();
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
  this.add = function(clip, x, y) {
    x = x || 0;
    y = y || 0;
    var anim = new Animation(this, clip, y, x);
    this.clips.push(anim);
    return anim;
  }

  // ======================================================

  // Generate the DOM object and apply the given pixelFunction
  // to each pixel, if one is given
  this.generateDom = function() {
    var box;
    if (this.canvas) {
      box = this.canvas;
      box.innerHTML = "";
    } else {
      this.canvas = box = document.createElement("div");
    }
    for (var i = 0; i < this.height; i++) {
      var row = document.createElement("div");
      row.style.float = "left";
      row.style.clear = "left";
      for (var j = 0; j < this.width; j++) {
        var pixel = document.createElement("div");
        pixel.style.width = pixel.style.height = this.pxSize + "px";
        pixel.style.float = "left";
        pixel.id = "c" + this.num + "_px_" + i + "_" + j;
        row.appendChild(pixel);
        if (this.pixelFunction) {
          this.pixelFunction(pixel);
        }
      }
      row.id = "c" + this.num + "_row_" + i;
      box.appendChild(row);
    }
    box.className = "PixelCanvas";
    box.id = "PixelCanvas_" + this.num;
    box.style.overflow = "hidden";
    box.style.width = this.width * this.pxSize + "px";
    box.style.backgroundColor = this.backgroundColor;
    this.parentNode.append(box);
  }

  this.generateDom();
}



/*
  Constructor for an Animation object
  Shouldn't be constructed directly, but is returned when add()
  is called on a PixelCanvas. Has operations with which the user
  can manipulate it.
*/
function Animation(canvas, anim, row, col) {
  this.anim = anim;
  this.row = row;
  this.col = col;
  this.frame = 0;
  this.width = anim["frames"][0][0].length;
  this.height = anim["frames"][0].length;
  this.frameCount = anim["frames"].length;
  this.canvas = canvas;

  this.getClipPts = function() {
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
    this.frame = (this.frame + 1) % this.frameCount;
  }

  // Translates the object on the canvas
  this.translate = function(dx, dy) {
    this.set(this.col + dx, this.row = dy);
  }

  // Sets the position on the canvas
  this.set = function(x, y) {
    canvas.updatePointsFor(this, true);  // clear the points this occupies
    this.row = y;
    this.col = x;
    canvas.updatePointsFor(this);
  }
}


