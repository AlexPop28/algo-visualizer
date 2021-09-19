/*
Helper class to make drawing on a canvas easier.
Usage: const canvas_helper = new CanvasHelper(canvas);
  canvas: a canvas object
*/

export default class CanvasHelper {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.canvas.width = canvas.offsetWidth;
    this.canvas.height = canvas.offsetHeight;
  }

  drawLine = (from_x, from_y, to_x, to_y, color) => {
    // draws a line starting from (from_x, from_y) to
    // (to_x, to_y) with a given color
    this.context.strokeStyle = color;
    this.context.moveTo(from_x, from_y);
    this.context.lineTo(to_x, to_y);
    this.context.stroke();
  };

  drawCircle = (x, y, radius, color) => {
    // draws a circle centered at (x, y) with a given radius and color
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.arc(x, y, radius, 0, 2 * Math.PI);
    this.context.stroke();
  };

  printCenteredText = (x, y, text, font_size, color) => {
    // prints text centered at (x, y) with a given font_size and color
    this.context.font = font_size + "px Arial";
    this.context.fillStyle = color;
    this.context.textAlign = "center";
    this.context.textBaseline = "middle";
    this.context.fillText(text, x, y);
  };

  clear = () => {
    // clears the content of the canvas
    this.context.clearRect(0, 0, this.width, this.height);
  };

  get width() {
    return this.canvas.width;
  }
  get height() {
    return this.canvas.height;
  }
  get minSideLength() {
    return Math.min(this.width, this.height);
  }
}
