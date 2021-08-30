class Data {
  constructor(i, k, type) {
    this.i = i;
    this.k = k;
    this.type = type;
  }
}

const removeChildren = (elem) => {
  while (elem.firstChild) {
    elem.removeChild(elem.lastChild);
  }
};

let pi = [];
let data = [];
let position = 0;

const prefixFunction = (s) => {
  const n = s.length;
  pi = [0];
  data = [];
  let k = 0;
  for (let i = 1; i < n; ++i) {
    data.push(new Data(i, k, "comp"));
    while (k > 0 && s[i] != s[k]) {
      data.push(new Data(i, k, "fail"));
      k = pi[k - 1];
      data.push(new Data(i, k, "comp"));
    }
    if (s[i] == s[k]) {
      data.push(new Data(i, k, "match"));
      ++k;
    } else {
      data.push(new Data(i, k, "fail"));
    }
    pi.push(k);
  }
};

const getCell = (row, col) => {
  return document.getElementById("id_col_" + row + "_" + col);
};

const compare = (cell) => {
  cell.classList.add("compare");
};

const match = (cell) => {
  cell.classList.add("match");
};

const fail = (cell) => {
  cell.classList.add("fail");
};

const clearClass = (class_name) => {
  const elements = document.getElementsByClassName(class_name);
  while (elements[0]) {
    elements[0].classList.remove(class_name);
  }
};

const loadStep = () => {
  clearClass("fail");
  clearClass("match");
  clearClass("compare");
  for (let i = 0; i < pi.length; ++i) {
    getCell("pi", i).innerHTML = "";
  }

  const step = data[position];
  for (let i = step.i - 1, k = step.k - 1; k >= 0; --k, --i) {
    match(getCell("i", i));
    match(getCell("k", k));
  }

  for (let i = 0; i < step.i; ++i) {
    getCell("pi", i).innerHTML = pi[i];
  }

  const s = document.getElementById("string").value;
  const text = document.getElementById("text");

  if (step.type == "comp") {
    compare(getCell("i", step.i));
    compare(getCell("k", step.k));
    getCell("pi", step.i).innerHTML = step.k;
    text.innerHTML = "Comparing s[" + step.i + "] with s[" + step.k + "].";
  } else if (step.type == "match") {
    match(getCell("i", step.i));
    match(getCell("k", step.k));
    getCell("pi", step.i).innerHTML = pi[step.i];
    text.innerHTML = "Match! s[" + step.i + "] is equal to s[" + step.k + "].";
  } else {
    console.assert(step.type == "fail");
    fail(getCell("i", step.i));
    fail(getCell("k", step.k));
    getCell("pi", step.i).innerHTML = step.k;
    text.innerHTML =
      "Fail! s[" + step.i + "] is not equal to s[" + step.k + "]";
  }
};

const nextStep = () => {
  if (position + 1 < data.length) {
    ++position;
    loadStep();
  } else if (data.length > 0) {
    alert("No next step available");
  } else {
    alert("Error: string length less than 2");
  }
  return false;
};

const prevStep = () => {
  if (position > 0) {
    --position;
    loadStep();
  } else if (data.length > 0) {
    alert("No previous step available");
  } else {
    alert("Error: string length less than 2");
  }
  return false;
};

const initSimulation = () => {
  const s = document.getElementById("string").value;
  const n = s.length;
  prefixFunction(s);

  const table = document.createElement("table");
  table.classList.add("table");
  table.classList.add("table-bordered");

  const simulation = document.getElementById("simulation");
  removeChildren(simulation);
  simulation.appendChild(table);

  const row_i = table.insertRow(0);
  row_i.id = "id_row_i";

  const row_k = table.insertRow(1);
  row_k.id = "id_row_k";

  const pi = table.insertRow(2);
  pi.id = "id_row_pi";

  for (let i = 0; i < n; ++i) {
    const col_i = row_i.insertCell(i);
    col_i.id = "id_col_i_" + i;

    const col_k = row_k.insertCell(i);
    col_k.id = "id_col_k_" + i;

    const col_pi = pi.insertCell(i);
    col_pi.id = "id_col_pi_" + i;

    col_i.innerHTML = s.charAt(i);
    col_k.innerHTML = s.charAt(i);
    if (i == 0) {
      col_pi.innerHTML = "0";
    }
  }

  position = 0;
  if (n >= 2) {
    loadStep();
  }

  return false;
};
