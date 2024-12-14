// https://adventofcode.com/2024/day/13

const fs = require("node:fs/promises");

async function parseFile(addToPrize = 0) {
  const file = await fs.readFile("input.txt", "utf-8");
  const numRegex = /([1-9])\w+/g;
  const numInstances = file.match(numRegex);

  const machines = [];
  for (let i = 0; i < numInstances.length; i += 6) {
    const machine = {
      a: {
        x: Number(numInstances[i]),
        y: Number(numInstances[i + 1]),
      },
      b: {
        x: Number(numInstances[i + 2]),
        y: Number(numInstances[i + 3]),
      },
      prize: {
        x: Number(numInstances[i + 4]) + addToPrize,
        y: Number(numInstances[i + 5]) + addToPrize,
      },
    };
    machines.push(machine);
  }

  return machines;
}

function getNumMovesMachine(machine) {
  const { a, b, prize } = machine;
  const numBPress = (a.x * prize.y - a.y * prize.x) / (a.x * b.y - a.y * b.x);
  const numAPress = (prize.x - b.x * numBPress) / a.x;

  const isValid =
    numAPress > 0 &&
    numBPress > 0 &&
    Number.isInteger(numAPress) &&
    Number.isInteger(numBPress);

  return {
    isValid,
    a: numAPress,
    b: numBPress,
  };
}

async function part1() {
  const machines = await parseFile();

  console.time();

  let acc = 0;
  machines.forEach((machine) => {
    const res = getNumMovesMachine(machine);
    if (res.isValid) {
      acc += res.a * 3 + res.b;
    }
  });

  console.timeEnd();
  console.log(acc);
  return acc;
}

async function part2() {
  const machines = await parseFile(10000000000000);

  console.time();

  let acc = 0;
  machines.forEach((machine) => {
    const res = getNumMovesMachine(machine);
    if (res.isValid) {
      acc += res.a * 3 + res.b;
    }
  });

  console.timeEnd();
  console.log(acc);
  return acc;
}

part1();
// part2();

// answers
// 1: 39290 (0.18 ms)
// 2: 73458657399094 (0.14 ms)
