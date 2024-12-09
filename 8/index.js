// https://adventofcode.com/2024/day/6

const fs = require("node:fs/promises");

async function parseFile() {
  const file = await fs.readFile("input.txt", "utf-8");
  const lines = file.split("\n");
  const matrix = lines.map((line) => line.split(""));

  return matrix;
}

function parseAntenas(map) {
  const antenas = {};

  map.forEach((line, i) =>
    line.forEach((cell, j) => {
      if (cell !== ".") {
        antenas[cell] ? antenas[cell].push([i, j]) : (antenas[cell] = [[i, j]]);
      }
    })
  );

  return antenas;
}

async function part1() {
  const map = await parseFile();

  console.time();
  const width = map[0].length;
  const height = map.length;
  const antinodes = [];

  const antenas = parseAntenas(map);
  Object.entries(antenas).forEach(([key, value]) => {
    value.forEach(([i, j], index) => {
      value.slice(index + 1).forEach(([coordi, coordj]) => {
        const diffi = i - coordi;
        const diffj = j - coordj;

        antinodes.push([i + diffi, j + diffj]);
        antinodes.push([coordi - diffi, coordj - diffj]);
      });
    });
  });

  const validAntinodes = antinodes
    .filter(([i, j]) => i >= 0 && i < width && j >= 0 && j < height)
    .map(([i, j]) => `${i}-${j}`);
  const uniqueAntinodes = new Set(validAntinodes);
  console.log(uniqueAntinodes.size);

  console.timeEnd();

  return uniqueAntinodes.size;
}

async function part2() {
  const map = await parseFile();

  console.time();
  const width = map[0].length;
  const height = map.length;
  const antinodes = [];

  const antenas = parseAntenas(map);
  Object.entries(antenas).forEach(([key, value]) => {
    value.forEach(([i, j], index) => {
      value.slice(index + 1).forEach(([coordi, coordj]) => {
        const diffi = i - coordi;
        const diffj = j - coordj;

        // pick 1 antena and go into both directions through the matrix
        let currentI = i;
        let currentJ = j;
        do {
          antinodes.push([currentI, currentJ]);
          currentI += diffi;
          currentJ += diffj;
        } while (
          currentI >= 0 &&
          currentI < width &&
          currentJ >= 0 &&
          currentJ < height
        );

        // reset local vars and go the other way
        currentI = i;
        currentJ = j;
        do {
          // we're pushing this one twice, it gets filtered out in the end but
          // it's a possible optimization
          antinodes.push([currentI, currentJ]);
          currentI += -diffi;
          currentJ += -diffj;
        } while (
          currentI >= 0 &&
          currentI < width &&
          currentJ >= 0 &&
          currentJ < height
        );
      });
    });
  });

  const validAntinodes = antinodes
    .filter(([i, j]) => i >= 0 && i < width && j >= 0 && j < height)
    .map(([i, j]) => `${i}-${j}`);
  const uniqueAntinodes = new Set(validAntinodes);
  console.log(uniqueAntinodes.size);

  console.timeEnd();

  return uniqueAntinodes.size;
}

// part1();
part2();

// answers
// 1: 351
// 2:
