// https://adventofcode.com/2024/day/10

const fs = require("node:fs/promises");

async function parseFile() {
  const file = await fs.readFile("input.txt", "utf-8");
  const line = file.split(" ").map(Number);

  return line;
}

function blink(stones) {
  const result = [];

  stones.forEach((stone) => {
    if (stone === 0) {
      result.push(1);
      return;
    }

    const stringStone = stone.toString();

    if (stringStone.length % 2 === 0) {
      result.push(Number(stringStone.substring(0, stringStone.length / 2)));
      result.push(
        Number(
          stringStone.substring(stringStone.length / 2, stringStone.length)
        )
      );
      return;
    }

    result.push(stone * 2024);
  });

  return result;
}

async function part1() {
  const stones = await parseFile();

  console.time();

  let newStones = stones;
  for (let i = 0; i < 75; i++) {
    newStones = blink(newStones);
  }

  const numOfStones = newStones.length;
  console.log(numOfStones);
  console.timeEnd();
  return numOfStones;
}

function recursiveBlink(stones, numberOfTimesToRun) {
  if (numberOfTimesToRun === 0) return 1;
  if (!stones.length) return 0;

  const result = [];
  const [stone, ...rest] = stones;

  if (stone === 0) {
    result.push(1);
    return (
      recursiveBlink([1], numberOfTimesToRun - 1) +
      recursiveBlink(rest, numberOfTimesToRun)
    );
  }

  const stringStone = stone.toString();

  if (stringStone.length % 2 === 0) {
    const firstStone = Number(stringStone.substring(0, stringStone.length / 2));
    const secondStone = Number(
      stringStone.substring(stringStone.length / 2, stringStone.length)
    );
    return (
      recursiveBlink([firstStone], numberOfTimesToRun - 1) +
      recursiveBlink([secondStone], numberOfTimesToRun - 1) +
      recursiveBlink(rest, numberOfTimesToRun)
    );
  }

  return (
    recursiveBlink([stone * 2024], numberOfTimesToRun - 1) +
    recursiveBlink(rest, numberOfTimesToRun)
  );
}

function recursiveBlinkWithMemoization(stones, numberOfTimesToRun, memo) {
  if (numberOfTimesToRun === 0) return 1;
  if (!stones.length) return 0;

  const result = [];
  const [stone, ...rest] = stones;
  // if we have that stone memoized let's do something with it
  if (memo?.[stone]) {
    if (memo[stone]?.[numberOfTimesToRun]) {
      return (
        memo[stone][numberOfTimesToRun].length +
        recursiveBlinkWithMemoization(rest, numberOfTimesToRun, memo)
      );
    }
  }

  if (stone === 0) {
    result.push(1);
    return (
      recursiveBlinkWithMemoization([1], numberOfTimesToRun - 1, memo) +
      recursiveBlinkWithMemoization(rest, numberOfTimesToRun, memo)
    );
  }

  const stringStone = stone.toString();

  if (stringStone.length % 2 === 0) {
    const firstStone = Number(stringStone.substring(0, stringStone.length / 2));
    const secondStone = Number(
      stringStone.substring(stringStone.length / 2, stringStone.length)
    );
    return (
      recursiveBlinkWithMemoization(
        [firstStone],
        numberOfTimesToRun - 1,
        memo
      ) +
      recursiveBlinkWithMemoization(
        [secondStone],
        numberOfTimesToRun - 1,
        memo
      ) +
      recursiveBlinkWithMemoization(rest, numberOfTimesToRun, memo)
    );
  }

  return (
    recursiveBlinkWithMemoization(
      [stone * 2024],
      numberOfTimesToRun - 1,
      memo
    ) + recursiveBlinkWithMemoization(rest, numberOfTimesToRun, memo)
  );
}

function loadMemoization() {
  const memoData = {};
  // memoize everything 1-99
  for (let i = 0; i < 100; i++) {
    let newStones = [i];
    memoData[i] = [];
    memoData[i].push(newStones);
    // for 25 blinks
    for (let j = 1; j <= 30; j++) {
      newStones = blink(newStones);
      memoData[i].push(newStones);
    }
  }

  return memoData;
}

async function part2() {
  const stones = await parseFile();

  console.time();

  const memoData = loadMemoization();

  const acc = recursiveBlinkWithMemoization(stones, 25, memoData);

  console.log(acc);
  console.timeEnd();

  return acc;
}

part1();
// part2();

// answers
// 1: 235850
// 2: 279903140844645 (3mins 42sec)
// a better performance is done in v2.js
