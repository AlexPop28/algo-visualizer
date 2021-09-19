import CanvasHelper from "./CanvasHelper.js";
import TreePlotter from "./TreePlotter.js";

let canvas = new CanvasHelper(document.getElementById("canvas"));

const nodeDiameter = () => {
  return Math.floor(
    (canvas.minSideLength *
      parseInt(document.getElementById("node-diameter").value, 10)) /
      300
  );
};

const nodeSpacing = () => {
  return Math.floor(
    (canvas.minSideLength *
      parseInt(document.getElementById("node-spacing").value, 10)) /
      300
  );
};

const labelSize = () => {
  return parseInt(document.getElementById("label-size").value, 10);
};

class TrieNode {
  constructor() {
    this.next = [];
  }

  insert = (string, index) => {
    if (index == string.length) return;
    const label = string.charCodeAt(index);
    if (this.next[label] === undefined) {
      this.next[label] = new TrieNode();
    }
    this.next[label].insert(string, index + 1);
  };

  render = (canvas) => {
    canvas.drawCircle(
      this.x,
      this.y,
      nodeDiameter() / 2,
      getComputedStyle(document.body).color
    );
    this.next.forEach((child) => {
      child.render(canvas);
    });
  };
}

const getStrings = (text) => {
  // This function creates an array of strings based on the line endings in text
  text += "\n";
  let strings = [];
  let current_string = "";
  for (let c of text) {
    if (c != "\n") {
      current_string += c;
    } else {
      strings.push(current_string);
      current_string = "";
    }
  }
  return strings;
};

let root = new TrieNode();
let tree_plotter;

const buildTrie = (strings) => {
  root = new TrieNode();
  for (let string of strings) {
    root.insert(string, 0);
  }
};

const render = () => {
  canvas.clear();
  canvas = new CanvasHelper(document.getElementById("canvas"));
  tree_plotter = new TreePlotter(root, nodeDiameter, nodeSpacing);
  root.render(canvas);
};

const handleInputChange = () => {
  const input_text = document.getElementById("input-text").value;
  const strings = getStrings(input_text);
  buildTrie(strings);
  render();
};

const init = () => {
  const inputTags = document.getElementsByTagName("input");
  for (let input of inputTags) {
    input.onchange = () => render();
    input.min = 1;
    input.max = 100;
  }
  document.getElementById("input-text").onkeyup = () => handleInputChange();
  window.onresize = () => render();
};

init();
