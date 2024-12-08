// https://adventofcode.com/2024/day/7

const fs = require("node:fs/promises");

async function parseFile() {
  const file = (await fs.readFile("input.txt", "utf-8")).split("\n");
  const equations = file.map((line) => {
    const [result, numbers] = line.split(":");
    return [
      Number(result),
      numbers
        .trim()
        .split(" ")
        .map((n) => Number(n)),
    ];
  });

  return equations;
}

function isEquationCorrect(result, remainingNumbers, partialResult = 0) {
  if (partialResult > result || !remainingNumbers.length) {
    return result === partialResult;
  }

  const [currentNumber, ...rest] = remainingNumbers;

  if (isEquationCorrect(result, rest, (partialResult || 1) * currentNumber)) {
    return true;
  }

  if (isEquationCorrect(result, rest, partialResult + currentNumber)) {
    return true;
  }

  return false;

  // return [
  //   isEquationCorrect(result, rest, (partialResult || 1) * currentNumber),
  //   isEquationCorrect(result, rest, partialResult + currentNumber),
  // ];
}

async function part1() {
  const equations = await parseFile();

  console.time();
  let acc = 0;
  equations
    .filter(
      (eq) => isEquationCorrect(eq[0], eq[1].slice(1), eq[1][0])
      // isEquationCorrect(eq[0], eq[1])
      // .flat(eq[1].length - 1)
      // .includes(true)
    )
    .forEach((eq) => (acc += eq[0]));

  console.log(acc);
  console.timeEnd();
  return acc;
}

function isEquationCorrect2(result, remainingNumbers, partialResult = 0) {
  if (partialResult > result || !remainingNumbers.length) {
    return result === partialResult;
  }

  const [currentNumber, ...rest] = remainingNumbers;

  if (isEquationCorrect2(result, rest, (partialResult || 1) * currentNumber)) {
    return true;
  }

  if (isEquationCorrect2(result, rest, partialResult + currentNumber)) {
    return true;
  }

  if (
    isEquationCorrect2(
      result,
      rest,
      partialResult * 10 ** Math.floor(Math.log10(currentNumber) + 1) +
        currentNumber
    )
  ) {
    return true;
  }

  return false;

  // return [
  //   isEquationCorrect2(result, rest, (partialResult || 1) * currentNumber),
  //   isEquationCorrect2(result, rest, partialResult + currentNumber),
  //   isEquationCorrect2(
  //     result,
  //     rest,
  //     Number(partialResult.toString() + currentNumber.toString())
  //   ),
  // ];
}

async function part2() {
  const equations = await parseFile();

  console.time();
  const acc = equations.reduce((acc, eq) => {
    if (isEquationCorrect2(eq[0], eq[1].slice(1), eq[1][0])) {
      return acc + eq[0];
    }
    return acc;
  }, 0);

  console.timeEnd();

  console.log(acc);
  return acc;
}

// part1();
part2();

// answers
// 1: 7710205485870
// 2:
