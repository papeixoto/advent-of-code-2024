// https://adventofcode.com/2024/day/4

const fs = require("node:fs/promises");

const DIRECTIONS = {
  N: "N",
  NE: "NE",
  E: "E",
  SE: "SE",
  S: "S",
  SO: "SO",
  O: "O",
  NO: "NO",
};

function searchForXMAS(i, j, matrix) {
  let acc = 0;
  Object.values(DIRECTIONS).forEach((direction) => {
    switch (direction) {
      case DIRECTIONS.N:
        if (matrix?.[i - 1]?.[j] !== "M") break;
        if (matrix?.[i - 2]?.[j] !== "A") break;
        if (matrix?.[i - 3]?.[j] !== "S") break;
        // console.log("N");
        acc += 1;
        break;
      case DIRECTIONS.NE:
        if (matrix?.[i - 1]?.[j + 1] !== "M") break;
        if (matrix?.[i - 2]?.[j + 2] !== "A") break;
        if (matrix?.[i - 3]?.[j + 3] !== "S") break;
        // console.log("NE");
        acc += 1;
        break;
      case DIRECTIONS.E:
        if (matrix?.[i]?.[j + 1] !== "M") break;
        if (matrix?.[i]?.[j + 2] !== "A") break;
        if (matrix?.[i]?.[j + 3] !== "S") break;
        // console.log("E");
        acc += 1;
        break;
      case DIRECTIONS.SE:
        if (matrix?.[i + 1]?.[j + 1] !== "M") break;
        if (matrix?.[i + 2]?.[j + 2] !== "A") break;
        if (matrix?.[i + 3]?.[j + 3] !== "S") break;
        // console.log("SE");
        acc += 1;
        break;
      case DIRECTIONS.S:
        if (matrix?.[i + 1]?.[j] !== "M") break;
        if (matrix?.[i + 2]?.[j] !== "A") break;
        if (matrix?.[i + 3]?.[j] !== "S") break;
        // console.log("S");
        acc += 1;
        break;
      case DIRECTIONS.SO:
        if (matrix?.[i + 1]?.[j - 1] !== "M") break;
        if (matrix?.[i + 2]?.[j - 2] !== "A") break;
        if (matrix?.[i + 3]?.[j - 3] !== "S") break;
        // console.log("SO");
        acc += 1;
        break;
      case DIRECTIONS.O:
        if (matrix?.[i]?.[j - 1] !== "M") break;
        if (matrix?.[i]?.[j - 2] !== "A") break;
        if (matrix?.[i]?.[j - 3] !== "S") break;
        // console.log("O");
        acc += 1;
        break;
      case DIRECTIONS.NO:
        if (matrix?.[i - 1]?.[j - 1] !== "M") break;
        if (matrix?.[i - 2]?.[j - 2] !== "A") break;
        if (matrix?.[i - 3]?.[j - 3] !== "S") break;
        // console.log("NO");
        acc += 1;
        break;
      default:
        return;
    }
  });

  return acc;
}

// not the most efficient but let's search when we find an X in the 8 directions
async function xmasSearch() {
  const file = await fs.readFile("input.txt", "utf-8");
  const lines = file.split("\n");
  const matrix = lines.map((line) => line.split(""));

  let acc = 0;
  matrix.forEach((line, i) => {
    line.forEach((cell, j) => {
      if (cell === "X") {
        const localAcc = searchForXMAS(i, j, matrix);
        acc += localAcc;
      }
    });
  });

  console.log("acc ", acc);
  return acc;
}

function searchForCrossMas(i, j, matrix) {
  // need to find an MAS for each X direction
  const topLeft = matrix?.[i - 1]?.[j - 1];
  const botRight = matrix?.[i + 1]?.[j + 1];

  const botLeft = matrix?.[i + 1]?.[j - 1];
  const topRight = matrix?.[i - 1]?.[j + 1];

  // first part topLeft to botRight
  const isFirstPartValid =
    (topLeft === "M" && botRight === "S") ||
    (topLeft === "S" && botRight === "M");
  // second part botLeft to topRight
  const isSecondPartValid =
    (botLeft === "M" && topRight === "S") ||
    (botLeft === "S" && topRight === "M");

  return isFirstPartValid && isSecondPartValid;
}

async function crossMasSearch() {
  const file = await fs.readFile("input.txt", "utf-8");
  const lines = file.split("\n");
  const matrix = lines.map((line) => line.split(""));

  let acc = 0;
  matrix.forEach((line, i) => {
    line.forEach((cell, j) => {
      if (cell === "A") {
        if (searchForCrossMas(i, j, matrix)) {
          acc += 1;
        }
      }
    });
  });

  console.log("acc ", acc);
  return acc;
}

// xmasSearch();
// crossMasSearch();

// answers:
// 1: 2571
// 2: 1992
