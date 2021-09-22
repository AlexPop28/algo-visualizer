import CanvasHelper from "./CanvasHelper.js";
import TreePlotter from "./TreePlotter.js";
import * as Geometry from "./Geometry.js";

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

  drawNode = (canvas) => {
    // draws current node to canvas
    canvas.drawCircle(
      this.x,
      this.y,
      nodeDiameter() / 2,
      getComputedStyle(document.body).color
    );
  };

  getEdgeSegment = (node) => {
    // returns a Geometry.Segment object representing the segment
    // corresponding to the edge this -> node
    const current = new Geometry.Circle(this.x, this.y, nodeDiameter() / 2);
    const other = new Geometry.Circle(node.x, node.y, nodeDiameter() / 2);
    const edge = new Geometry.Segment(this.x, this.y, node.x, node.y);

    const from = Geometry.segmentCircleIntersection(edge, current)[0];
    const to = Geometry.segmentCircleIntersection(edge, other)[0];

    return new Geometry.Segment(from.x, from.y, to.x, to.y);
  };

  drawEdge = (edge_segment) => {
    // draws an edge between the current node and "node"
    const from = edge_segment.a,
      to = edge_segment.b;
    canvas.drawLine(
      from.x,
      from.y,
      to.x,
      to.y,
      getComputedStyle(document.body).color
    );
  };

  printEdgeLabel = (edge_segment, label) => {
    // prints the label of the edge
    let x = (edge_segment.a.x + edge_segment.b.x) / 2;
    let y = (edge_segment.a.y + edge_segment.b.y) / 2;

    if (edge_segment.a.x < edge_segment.b.x) {
      x += (2 * labelSize()) / 3;
    } else {
      x -= (2 * labelSize()) / 3;
    }

    canvas.printCenteredText(
      x,
      y,
      label,
      labelSize(),
      getComputedStyle(document.body).color
    );
  };

  render = (canvas) => {
    // renders the trie on the canvas
    this.drawNode(canvas);
    this.next.forEach((child, index) => {
      const label = String.fromCharCode(index);
      const edge_segment = this.getEdgeSegment(child);
      this.printEdgeLabel(edge_segment, label);
      this.drawEdge(edge_segment);
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

const buildTrie = (strings) => {
  root = new TrieNode();
  for (let string of strings) {
    root.insert(string, 0);
  }
};

const render = () => {
  canvas.clear();
  canvas = new CanvasHelper(document.getElementById("canvas"));
  const tree_plotter = new TreePlotter(root, nodeDiameter, nodeSpacing);
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
