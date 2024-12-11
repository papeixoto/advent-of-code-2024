// https://adventofcode.com/2024/day/9

const fs = require("node:fs/promises");

async function parseFile() {
  const file = await fs.readFile("input.txt", "utf-8");
  const lines = file.split("\n");
  const matrix = lines.map((line) => line.split("").map(Number));

  return matrix;
}

function getPossibleStartsForEnd(i, j, matrix, height, width, previousCell) {
  if (i < 0 || i >= height || j < 0 || j >= width) {
    return "";
  }

  const currentCell = matrix[i][j];
  if (currentCell !== previousCell - 1) return "";

  if (currentCell === 0) return [`${i}-${j}`];

  return [
    ...getPossibleStartsForEnd(i + 1, j, matrix, height, width, currentCell),
    ...getPossibleStartsForEnd(i - 1, j, matrix, height, width, currentCell),
    ...getPossibleStartsForEnd(i, j + 1, matrix, height, width, currentCell),
    ...getPossibleStartsForEnd(i, j - 1, matrix, height, width, currentCell),
  ];
}

async function part1() {
  const matrix = await parseFile();
  const height = matrix.length;
  const width = matrix[0].length;

  console.time();

  let acc = [];
  matrix.forEach((line, i) => {
    line.forEach((cell, j) => {
      if (cell === 9)
        acc.push(getPossibleStartsForEnd(i, j, matrix, height, width, 10));
    });
  });

  let sum = 0;
  acc.forEach((el) => (sum += new Set(el).size));

  console.timeEnd();
  console.log(sum);
  return sum;
}

function getPossibleEndsForStart(i, j, matrix, height, width, previousCell) {
  if (i < 0 || i >= height || j < 0 || j >= width) {
    return 0;
  }

  const currentCell = matrix[i][j];
  if (currentCell !== previousCell + 1) return 0;

  if (currentCell === 9) return 1;

  return (
    getPossibleEndsForStart(i + 1, j, matrix, height, width, currentCell) +
    getPossibleEndsForStart(i - 1, j, matrix, height, width, currentCell) +
    getPossibleEndsForStart(i, j + 1, matrix, height, width, currentCell) +
    getPossibleEndsForStart(i, j - 1, matrix, height, width, currentCell)
  );
}

async function part2() {
  const matrix = await parseFile();
  const height = matrix.length;
  const width = matrix[0].length;

  console.time();

  let acc = 0;
  matrix.forEach((line, i) => {
    line.forEach((cell, j) => {
      if (cell === 0)
        acc += getPossibleEndsForStart(i, j, matrix, height, width, -1);
    });
  });

  console.timeEnd();
  console.log(acc);
  return acc;
}

// part1();
// part2();

// answers
// 1: 566
// 2: 1324
