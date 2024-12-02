// https://adventofcode.com/2024/day/1

// It seems that there's no point in ordering the lists so I'll just calculate the diffence the following way:

// sum (l2[i] - list[i]) for i in range(0, len(list))
// example for this reasoning
// for the 2 equal lists 1 1 3
// l1: 1 1 3
// l2: 3 1 1
// diff: 2 0 -2 = 0
// which is the correct answer

const fs = require("node:fs/promises");

// result 844616
// is not correct
async function diff() {
  const file = await fs.readFile("input.txt", "utf-8");
  const lines = file.split("\n");
  const l1 = [];
  const l2 = [];
  lines.forEach((l) => {
    const [n1, n2] = l.split("   ");
    l1.push(n1);
    l2.push(n2);
  });

  console.log("l1 ", l1);
  console.log("l2 ", l2);

  let diff = 0;
  l1.forEach((el, i) => {
    console.log("starting diff ", diff);
    diff += el - l2[i];
    console.log(`${el} - ${l2[i]} = ${el - l2[i]}`);
    console.log("new diff ", diff);
  });

  const result = Math.abs(diff);
  console.log("result ", result);
  return result;
}

// trying again now with sorting the lists and converting to numbers
// the first assumption is not valid
// example l1: 5 1
// l2: 2 3
// sum of unordered diffs: 1
// ordering then adding absolute diffs: 3
async function diff2() {
  const file = await fs.readFile("input.txt", "utf-8");
  const lines = file.split("\n");
  const l1 = [];
  const l2 = [];
  lines.forEach((l) => {
    const [n1, n2] = l.split("   ");
    l1.push(Number(n1));
    l2.push(Number(n2));
  });

  l1.sort((a, b) => {
    return a - b;
  });
  l2.sort((a, b) => {
    return a - b;
  });

  let diff = 0;
  l1.forEach((el, i) => {
    diff += Math.abs(el - l2[i]);
  });

  console.log(diff);
  return diff;
}

async function similarityScore() {
  const file = await fs.readFile("input.txt", "utf-8");
  const lines = file.split("\n");
  // instead of time complexity O(N^2) let's make the second list a Map with [number, numberOfTimesItAppears]
  // this makes the time complexity O(N) since we only need to iterate the first array then access the l2 set wich is a O(1) operation
  const l1 = [];
  const l2 = new Map();
  lines.forEach((l) => {
    const [n1, n2] = l.split("   ");
    l1.push(Number(n1));

    const numbern2 = Number(n2);
    l2.set(numbern2, l2.has(numbern2) ? l2.get(numbern2) + 1 : 1);
  });

  console.log("l2 ", l2);

  let similarityScore = 0;
  l1.forEach((n) => {
    const howManyTimesItAppears = l2.get(n) || 0;
    similarityScore += n * howManyTimesItAppears;
  });

  console.log("similarityScore ", similarityScore);
  return similarityScore;
}

// diff();
diff2();
// similarityScore();

// answers
// 1 - 2057374
// 2 - 23177084
