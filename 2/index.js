// https://adventofcode.com/2024/day/2

const fs = require("node:fs/promises");

function isSafePath(report) {
  const isIncreasing = report[0] < report[1];

  let i = 0;
  let isSafe = true;
  // we're checking the next element so we can stop at the penultimate element
  // on the not contemplated edge case of a single digit array it just skips the loop and returns true
  while (i < report.length) {
    const thisRecord = report[i];
    const nextRecord = report[i + 1];
    const differenceBetweenRecords = Math.abs(thisRecord - nextRecord);

    // check the diff
    if (differenceBetweenRecords < 1 || differenceBetweenRecords > 3) {
      isSafe = false;
      break;
    }

    if (isIncreasing && nextRecord <= thisRecord) {
      isSafe = false;
      break;
    }

    if (!isIncreasing && nextRecord >= thisRecord) {
      isSafe = false;
      break;
    }
    i++;
  }

  return isSafe;
}

async function howManySafePaths() {
  const file = await fs.readFile("input.txt", "utf-8");
  const reports = file
    .split("\n")
    .map((l) => l.split(" ").map((record) => Number(record)));

  let counter = 0;
  reports.forEach((report) => {
    if (isSafePath(report)) {
      counter += 1;
    }
  });

  console.log(counter);
  return counter;
}

function isSafePathWithProblemDampner(report, isFirstTry = true) {
  // condition does not work for this case:
  // const isIncreasing = report[0] < report[1];
  // [ 18, 16, 17, 18, 20, 22 ]  unsafe
  // trying again with  [ 18, 17, 18, 23, 29 ] false
  // it should take out the 18
  const isIncreasing = report[0] < report[1];

  let i = 0;
  let isSafe = true;
  // we're checking the next element so we can stop at the penultimate element
  // on the not contemplated edge case of a single digit array it just skips the loop and returns true
  while (i < report.length) {
    const thisRecord = report[i];
    const nextRecord = report[i + 1];
    const differenceBetweenRecords = Math.abs(thisRecord - nextRecord);

    // check the diff
    if (differenceBetweenRecords < 1 || differenceBetweenRecords > 3) {
      isSafe = false;
      break;
    }

    if (isIncreasing && nextRecord <= thisRecord) {
      isSafe = false;
      break;
    }

    if (!isIncreasing && nextRecord >= thisRecord) {
      isSafe = false;
      break;
    }
    i++;
  }

  // first try and not safe -> let's try again removing the element that failed
  if (isFirstTry && !isSafe) {
    let isSafe1 = false;
    let isSafe2 = false;
    let isSafe3 = false;

    if (i - 1 >= 0) {
      const copyOfRecord1 = [...report];
      copyOfRecord1.splice(i - 1, 1);
      isSafe1 = isSafePathWithProblemDampner(copyOfRecord1, false);
    }

    const copyOfRecord2 = [...report];
    copyOfRecord2.splice(i, 1);
    isSafe2 = isSafePathWithProblemDampner(copyOfRecord2, false);

    const copyOfRecord3 = [...report];
    copyOfRecord3.splice(i + 1, 1);
    isSafe3 = isSafePathWithProblemDampner(copyOfRecord3, false);

    return isSafe1 || isSafe2 || isSafe3;
  }

  return isSafe;
}

async function howManySafePathsWithProblemDampner() {
  const file = await fs.readFile("input.txt", "utf-8");
  const reports = file
    .split("\n")
    .map((l) => l.split(" ").map((record) => Number(record)));

  let counter = 0;
  reports.forEach((report) => {
    if (isSafePathWithProblemDampner(report)) {
      counter += 1;
    }
  });

  console.log(counter);
  return counter;
}

// howManySafePaths();
howManySafePathsWithProblemDampner();

// answer
// 1: 624
// 2: 658
