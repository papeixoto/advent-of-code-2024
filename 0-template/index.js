// https://adventofcode.com/2024/day/X

const fs = require("node:fs/promises");

async function parseFile() {
  const file = await fs.readFile("input.txt", "utf-8");
  return file;
}

async function part1() {
  const file = await parseFile();

  console.time();

  let acc = 0;
  console.timeEnd();
  console.log(acc);
  return acc;
}

part1();
// part2();

// answers
// 1:
// 2:
