/*
This class computes optimal positions of nodes in a general tree using
a modified algorithm based on the ideas presented at
https://www.cs.unc.edu/techreports/89-034.pdf

Usage: const tree_plotter = new TreePlotter(root, nodeDiameter, nodeSpacing);
  root: -a class object representing the root of the tree
        -children of a node should be stored in a list called next
          e.g.: children of root are stored in root.next
  nodeDiameter: a function returning the diameter of a node in pixels
  nodeSpacing: a function returning the minimum spacing between nodes in pixels

Effects: Each node will have the following fields computed:
  -x: the x coordinate of the node
  -y: the y coordinate of the node
  -mod: a lazy value used by the algorithm to shift subtrees
  -parent: a reference to the parent of a node in the tree
  -left_sibling: a reference to the left sibling of a node or null if there isn't one
  -right_sibling: a reference to the right sibling of a node or null if there isn't one
  -first_child: a reference to the first child of a node or null if the node is a leaf
*/

export default class TreePlotter {
  constructor(root, nodeDiameter, nodeSpacing) {
    this.root = root;
    this.nodeDiameter = nodeDiameter;
    this.nodeSpacing = nodeSpacing;

    root.parent = null;
    root.left_sibling = null;
    this.precomputeProps(root);

    root.y = nodeDiameter();
    this.computeInitialCoordinates(root);
    this.computeFinalCoordinates(root);
  }

  precomputeProps = (node) => {
    // initializes properties of nodes: mod, parent, left_sibling, right_sibling, first_child
    node.mod = 0;
    node.first_child = null;
    let left_sibling = null;
    node.next.forEach((child) => {
      if (node.first_child === null) node.first_child = child;
      child.left_sibling = left_sibling;
      if (left_sibling !== null) left_sibling.right_sibling = child;
      left_sibling = child;
      child.parent = node;
      this.precomputeProps(child);
    });
  };

  computeInitialCoordinates = (node) => {
    // computes preliminary (x, y) values for nodes
    node.next.forEach((child) => {
      child.y = node.y + this.nodeDiameter() + this.nodeSpacing(); // space between levels of the tree
      this.computeInitialCoordinates(child);
    });

    if (node.left_sibling) {
      node.x = node.left_sibling.x + this.nodeDiameter() + this.nodeSpacing();
    } else {
      node.x = this.nodeDiameter() / 2 + this.nodeSpacing();
    }

    // center node over its children
    if (node.next.length === 0) {
      // node is a leaf, it doesn't have any children
      return;
    }

    // else, compute the mean of the coordinates of its leftmost and rightmost children
    let min_x = null,
      max_x = null;
    node.next.forEach((child) => {
      min_x = min_x === null ? child.x : Math.min(min_x, child.x);
      max_x = max_x === null ? child.x : Math.max(max_x, child.x);
    });

    const mid_point = (min_x + max_x) / 2;
    if (node.left_sibling) {
      // shift the subtree
      node.mod = node.x - mid_point;
    } else {
      // shift node
      node.x = mid_point;
    }

    this.fixOverlaps(node);
  };

  fixOverlaps = (node) => {
    // fixes overlaps between the subtree of node and
    // those of its siblings by shifting them
    if (node.parent === null) return;

    const left_border = [];
    this.getBorder(node, left_border, Math.min);

    let sibling = node.parent.first_child;
    while (sibling !== node) {
      const right_border = [];
      this.getBorder(sibling, right_border, Math.max);

      let delta = 0; // how much should node be shifted to the right
      // in order to no longer intersect with sibling's subtree
      const max_depth = Math.min(left_border.length, right_border.length);
      for (let level = 1; level < max_depth; ++level) {
        delta = Math.max(
          delta,
          right_border[level] -
            left_border[level] +
            this.nodeDiameter() +
            this.nodeSpacing()
        );
      }

      if (delta > 0) {
        node.x += delta;
        node.mod += delta;
        this.centerSiblingsBetween(sibling, node);

        // we recompute the border because node moved
        left_border.length = 0;
        this.getBorder(node, left_border, Math.min);
      }
      sibling = sibling.right_sibling;
    }
  };

  centerSiblingsBetween = (first, last) => {
    // centers sibling nodes between first and last
    let cnt_nodes_between = 0;
    let node = first.right_sibling;
    while (node !== last) {
      ++cnt_nodes_between;
      node = node.right_sibling;
    }

    if (cnt_nodes_between == 0) return;

    let spacing = (last.x - first.x) / (1 + cnt_nodes_between);
    let current_spacing = spacing;

    node = first.right_sibling;
    while (node !== last) {
      let delta = first.x + current_spacing - node.x;
      node.x += delta;
      node.mod += delta;

      node = node.right_sibling;
      current_spacing += spacing;
    }
  };

  getBorder = (node, border, compare, mod_sum = 0, level = 0) => {
    // computes the border of node's subtree
    // use compare as Math.min for left border and Math.max for right border
    if (level === border.length) {
      border[level] = node.x + mod_sum;
    } else {
      border[level] = compare(border[level], node.x + mod_sum);
    }

    node.next.forEach((child) => {
      this.getBorder(child, border, compare, mod_sum + node.mod, level + 1);
    });
  };

  computeFinalCoordinates = (node, sum = 0) => {
    // computes the final x value for nodes
    node.x += sum;
    node.next.forEach((child) => {
      this.computeFinalCoordinates(child, sum + node.mod);
    });
  };
}
