// https://adventofcode.com/2024/day/9

const fs = require("node:fs/promises");

async function parseFile() {
  const file = await fs.readFile("input.txt", "utf-8");
  const lines = file.split("\n");
  const matrix = lines.map((line) => line.split(""));

  return matrix;
}

function getNumFences(i, j, matrix, plant, visited, localVisited, numFences) {
  if (localVisited.includes(`${i}-${j}`)) return numFences;
  const height = matrix.length;
  const width = matrix[0].length;

  if (i < 0 || i >= height || j < 0 || j >= width || matrix[i][j] !== plant) {
    return numFences + 1;
  }

  visited.push(`${i}-${j}`);
  localVisited.push(`${i}-${j}`);
  return (
    getNumFences(i + 1, j, matrix, plant, visited, localVisited, numFences) +
    getNumFences(i - 1, j, matrix, plant, visited, localVisited, numFences) +
    getNumFences(i, j + 1, matrix, plant, visited, localVisited, numFences) +
    getNumFences(i, j - 1, matrix, plant, visited, localVisited, numFences)
  );
}

async function part1() {
  const matrix = await parseFile();
  const height = matrix.length;
  const width = matrix[0].length;
  const visited = [];
  let localVisited = [];

  console.time();

  let acc = 0;
  matrix.forEach((line, i) => {
    line.forEach((cell, j) => {
      if (!visited.includes(`${i}-${j}`)) {
        acc +=
          getArea(i, j, matrix, cell, visited, localVisited, 0) *
          localVisited.length;
        localVisited = [];
      }
    });
  });

  console.timeEnd();
  console.log(acc);
  return acc;
}
// up, right, down, left
const DIRECTIONS = [0, 1, 2, 3];
function getNumberOfSidesFromArea(i, j, area, matrix) {
  // console.log("AREA ", area);
  const cell = matrix[i][j];
  // console.log("CELLL ", cell);
  let currentI = i - 1;
  let currentJ = j;
  let direction = 1;
  let numberOfSides = 0;
  let forceMoveAfterRotation = false;
  let turnRight = true;

  let numOfLoops = 0;
  do {
    numOfLoops++;
    // console.log("checking ", currentI, currentJ, direction);
    switch (direction) {
      case 0:
        // console.log("Area includes ? ", `${currentI}-${currentJ + 1}`);
        if (
          forceMoveAfterRotation ||
          (area.includes(`${currentI}-${currentJ + 1}`) &&
            matrix?.[currentI - 1]?.[currentJ] !== cell)
        ) {
          currentI -= 1;
          forceMoveAfterRotation = false;
          break;
        } else if (area.includes(`${currentI - 1}-${currentJ - 1}`)) {
          // console.log("Entering elif");
          turnRight = false;
        }
      case 1:
        // console.log("Area includes ? ", `${currentI + 1}-${currentJ}`);
        if (
          forceMoveAfterRotation ||
          (area.includes(`${currentI + 1}-${currentJ}`) &&
            matrix?.[currentI]?.[currentJ + 1] !== cell)
        ) {
          currentJ += 1;
          forceMoveAfterRotation = false;
          break;
        } else if (area.includes(`${currentI}-${currentJ + 1}`)) {
          // console.log("Entering elif");
          turnRight = false;
        }
      case 2:
        // console.log("force ", forceMoveAfterRotation);
        // console.log(area.includes(`${currentI}-${currentJ - 1}`));
        // console.log(
        //   matrix?.[currentI + 1]?.[currentJ] !== cell,
        //   matrix?.[currentI + 1]?.[currentJ],
        //   cell
        // );
        if (
          forceMoveAfterRotation ||
          (area.includes(`${currentI}-${currentJ - 1}`) &&
            matrix?.[currentI + 1]?.[currentJ] !== cell)
        ) {
          currentI += 1;
          forceMoveAfterRotation = false;
          break;
        } else if (area.includes(`${currentI + 1}-${currentJ}`)) {
          // console.log("Entering elif");
          turnRight = false;
        }
      case 3:
        if (
          forceMoveAfterRotation ||
          (area.includes(`${currentI - 1}-${currentJ}`) &&
            matrix?.[currentI]?.[currentJ - 1] !== cell)
        ) {
          currentJ -= 1;
          forceMoveAfterRotation = false;
          break;
        } else if (area.includes(`${currentI}-${currentJ - 1}`)) {
          // console.log("Entering elif");
          turnRight = false;
        }
      default:
        // console.log("DEFAULTING");
        // console.log("prevDir ", direction);
        direction = (direction + (turnRight ? 1 : -1)) % 4;
        // console.log("nextDir ", direction);
        forceMoveAfterRotation = true;
        turnRight = true;
        numberOfSides += 1;
    }
  } while (currentI !== i - 1 || currentJ !== j || direction !== 1);

  return numberOfSides;
}

function numSides(stringArea) {
  // transform Area
  const area = stringArea.map((cell) => {
    const [i, j] = cell.split("-");
    return [Number(i), Number(j)];
  });
  let minI = Number.MAX_SAFE_INTEGER;
  let maxI = 0;
  let minJ = Number.MAX_SAFE_INTEGER;
  let maxJ = 0;

  area.forEach(([i, j]) => {
    if (i < minI) minI = i;
    if (i > maxI) maxI = i;
    if (j < minJ) minJ = j;
    if (j > maxJ) maxJ = j;
  });

  // console.log(minI, maxI, minJ, maxJ);

  let sides = 0;
  // scan down
  let prev = [];
  for (let i = minI; i <= maxI; i++) {
    const now = area
      .filter(([a, b]) => a === i)
      .map(([a, b]) => b)
      .sort((a, b) => a - b);
    let countAsSide = true;
    for (j = minJ; j <= maxJ; j++) {
      if (now.includes(j)) {
        if (prev.includes(j)) {
          countAsSide = true;
        } else if (countAsSide) {
          sides++;
          countAsSide = false;
        }
      } else {
        countAsSide = true;
      }
    }
    prev = now;
  }

  // scan up
  prev = [];
  for (let i = maxI; i >= minI; i--) {
    const now = area
      .filter(([a, b]) => a === i)
      .map(([a, b]) => b)
      .sort((a, b) => a - b);
    let countAsSide = true;
    for (j = minJ; j <= maxJ; j++) {
      if (now.includes(j)) {
        if (prev.includes(j)) {
          countAsSide = true;
        } else if (countAsSide) {
          sides++;
          countAsSide = false;
        }
      } else {
        countAsSide = true;
      }
    }
    prev = now;
  }

  // scan right
  prev = [];
  for (let i = minJ; i <= maxJ; i++) {
    const now = area
      .filter(([a, b]) => b === i)
      .map(([a, b]) => a)
      .sort((a, b) => a - b);
    let countAsSide = true;
    for (j = minI; j <= maxI; j++) {
      if (now.includes(j)) {
        if (prev.includes(j)) {
          countAsSide = true;
        } else if (countAsSide) {
          sides++;
          countAsSide = false;
        }
      } else {
        countAsSide = true;
      }
    }
    prev = now;
  }

  // scan left
  prev = [];
  for (let i = maxJ; i >= minJ; i--) {
    const now = area
      .filter(([a, b]) => b === i)
      .map(([a, b]) => a)
      .sort((a, b) => a - b);
    let countAsSide = true;
    for (j = minI; j <= maxI; j++) {
      if (now.includes(j)) {
        if (prev.includes(j)) {
          countAsSide = true;
        } else if (countAsSide) {
          sides++;
          countAsSide = false;
        }
      } else {
        countAsSide = true;
      }
    }
    prev = now;
  }

  return sides;
}

async function part2() {
  const matrix = await parseFile();
  const height = matrix.length;
  const width = matrix[0].length;
  const visited = [];
  let localVisited = [];

  console.time();

  let acc = 0;
  matrix.forEach((line, i) => {
    line.forEach((cell, j) => {
      if (!visited.includes(`${i}-${j}`)) {
        getNumFences(i, j, matrix, cell, visited, localVisited, 0);
        const area = localVisited.length;
        const sides = numSides(localVisited);

        acc += area * sides;

        localVisited = [];
      }
    });
  });

  console.timeEnd();
  console.log(acc);
  return acc;
}

// part1();
part2();

// answers
// 1: 1400386 (280ms)
// 2: 851994 (300ms)
// I was trying a method to go around the area and count the sides, but it didn't work
// with areas with holes inside
// XXX
// XOX
// XXX
// So i went to the subreddit and this gif unlocked it for me
// https://www.reddit.com/media?url=https%3A%2F%2Fi.redd.it%2F16speesmxh6e1.gif
