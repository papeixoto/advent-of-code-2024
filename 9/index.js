// https://adventofcode.com/2024/day/9

const fs = require("node:fs/promises");

async function parseFile() {
  const file = await fs.readFile("input.txt", "utf-8");
  const line = file.split("").map(Number);

  return line;
}

async function part1() {
  const input = await parseFile();

  const output = [];
  input.forEach((el, index) => {
    if (index % 2 === 0) output.push(...Array(el).fill(index / 2));
    else output.push(...Array(el).fill());
  });

  console.time();

  let startIndex = 0;
  let endIndex = output.length - 1;

  while (startIndex < endIndex) {
    if (output[endIndex] === undefined) {
      endIndex -= 1;
      continue;
    }

    if (output[startIndex] === undefined) {
      output[startIndex] = output[endIndex];
      output[endIndex] = undefined;
    }

    startIndex += 1;
  }

  const sum = output.reduce((acc, el, index) => {
    if (el) return acc + el * index;
    return acc;
  }, 0);

  console.timeEnd();
  console.log(sum);
  return sum;
}

async function part2() {
  const input = await parseFile();

  console.time();
  const output = [];
  input.forEach((el, index) => {
    if (index % 2 === 0) output.push(Array(el).fill(index / 2));
    else output.push(Array(el).fill());
  });

  let startIndex = 0;
  let endIndex = output.length - 1;

  while (startIndex < endIndex) {
    if (output[endIndex]?.[0] === undefined) {
      endIndex -= 1;
      continue;
    }

    const elementToCheck = output[startIndex];

    if (elementToCheck.length && elementToCheck[0] === undefined) {
      let localEndIndex = endIndex;
      while (localEndIndex > startIndex) {
        if (
          output[localEndIndex]?.[0] !== undefined &&
          output[localEndIndex].length <= elementToCheck.length
        ) {
          const toTheEnd = elementToCheck.splice(
            0,
            output[localEndIndex].length
          );
          if (elementToCheck.length) {
            output.splice(startIndex, 0, output[localEndIndex]);
            output[localEndIndex + 1] = toTheEnd;
            endIndex += 1;
          } else {
            output[startIndex] = output[localEndIndex];
            output[localEndIndex] = toTheEnd;
          }
          break;
        }
        localEndIndex -= 1;
      }
    }

    startIndex += 1;
  }

  const sum = output.flat().reduce((acc, el, index) => {
    if (el) return acc + el * index;
    return acc;
  }, 0);

  console.timeEnd();
  console.log(sum);
  return sum;
}

// part1();
part2();

// answers
// 1: 6401092019345
// 2: 6431472344710
