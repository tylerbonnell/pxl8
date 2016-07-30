/*
 * Constructor for Canvas object
 */
function Canvas() {

}

function Prefab() {
  this.instantiate = function(row, col) {
    row = row || 0;
    col = col || 0;
    newElement = {
      row,
      col
    }
  }
}

function Animation() {

}