const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

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
  console.log(strings);
};
