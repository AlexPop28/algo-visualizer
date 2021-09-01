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
}

const getStrings = (text) => {
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

const handleInputChange = () => {
  const input_text = document.getElementById("input").value;
  const strings = getStrings(input_text);

  const root = new TrieNode();
  for (let string of strings) {
    root.insert(string, 0);
  }
};

document.getElementById("input").onkeyup = () => handleInputChange();
