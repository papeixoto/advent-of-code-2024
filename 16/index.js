// https://adventofcode.com/2024/day/16

const fs = require("node:fs/promises");

async function parseFile() {
  const file = await fs.readFile("input.txt", "utf-8");
  const map = file.split("\n").map((line) => line.split(""));

  return map;
}

function findInMap(map, char) {
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === char) return [i, j];
    }
  }
}

// up 0
// right 1
// down 2
// left 3
function calculateScoreForCell(
  map,
  i,
  j,
  scoreMap,
  score,
  direction,
  afterDirectionChange
) {
  const height = map.length;
  const width = map[0].length;
  if (i < 0 || i >= height || j < 0 || j >= width || map[i][j] === "#") return;

  if (scoreMap[i][j] === undefined || scoreMap[i][j] > score) {
    scoreMap[i][j] = score;
  } else if (!afterDirectionChange) {
    return;
  }

  // only try directions if we're moving ahead
  if (!afterDirectionChange) {
    // rotate left
    calculateScoreForCell(
      map,
      i,
      j,
      scoreMap,
      score + 1000,
      direction ? (direction - 1) % 4 : 3,
      true
    );
    // rotate right
    calculateScoreForCell(
      map,
      i,
      j,
      scoreMap,
      score + 1000,
      (direction + 1) % 4,
      true
    );
  }

  switch (direction) {
    case 0:
      calculateScoreForCell(
        map,
        i - 1,
        j,
        scoreMap,
        score + 1,
        direction,
        false
      );
      break;
    case 1:
      calculateScoreForCell(
        map,
        i,
        j + 1,
        scoreMap,
        score + 1,
        direction,
        false
      );
      break;
    case 2:
      calculateScoreForCell(
        map,
        i + 1,
        j,
        scoreMap,
        score + 1,
        direction,
        false
      );
      break;
    case 3:
      calculateScoreForCell(
        map,
        i,
        j - 1,
        scoreMap,
        score + 1,
        direction,
        false
      );
      break;
    default:
      console.log("ERROR");
      break;
  }
  return;
}

// up 0
// right 1
// down 2
// left 3
function bestPaths(
  map,
  i,
  j,
  scoreMap,
  score,
  direction,
  afterDirectionChange,
  thisPath = [],
  paths,
  bestScore
) {
  const height = map.length;
  const width = map[0].length;
  if (score > bestScore) return;
  if (i < 0 || i >= height || j < 0 || j >= width || map[i][j] === "#") return;
  const scoreMapkey = `${i}-${j}-${direction}`;
  thisPath.push(`${i}-${j}`);

  // console.log(i, j, score);

  if (score === bestScore && map[i][j] === "E") {
    console.log("bestScore", bestScore);
    console.log("FOUND", thisPath);
    paths.push(thisPath);
    return;
  }

  if (scoreMap[scoreMapkey] === undefined || scoreMap[scoreMapkey] >= score) {
    scoreMap[scoreMapkey] = score;
  } else if (!afterDirectionChange) {
    return;
  }

  // only try directions if we're moving ahead
  if (!afterDirectionChange) {
    // rotate left
    bestPaths(
      map,
      i,
      j,
      scoreMap,
      score + 1000,
      direction ? (direction - 1) % 4 : 3,
      true,
      [...thisPath],
      paths,
      bestScore
    );
    // rotate right
    bestPaths(
      map,
      i,
      j,
      scoreMap,
      score + 1000,
      (direction + 1) % 4,
      true,
      [...thisPath],
      paths,
      bestScore
    );
  }

  switch (direction) {
    case 0:
      bestPaths(
        map,
        i - 1,
        j,
        scoreMap,
        score + 1,
        direction,
        false,
        [...thisPath],
        paths,
        bestScore
      );
      break;
    case 1:
      bestPaths(
        map,
        i,
        j + 1,
        scoreMap,
        score + 1,
        direction,
        false,
        [...thisPath],
        paths,
        bestScore
      );
      break;
    case 2:
      bestPaths(
        map,
        i + 1,
        j,
        scoreMap,
        score + 1,
        direction,
        false,
        [...thisPath],
        paths,
        bestScore
      );
      break;
    case 3:
      bestPaths(
        map,
        i,
        j - 1,
        scoreMap,
        score + 1,
        direction,
        false,
        [...thisPath],
        paths,
        bestScore
      );
      break;
    default:
      console.log("ERROR");
      break;
  }
  return;
}

async function part1() {
  const map = await parseFile();
  console.time();
  const scoreMap = [];
  for (let i = 0; i < map.length; i++) {
    scoreMap.push(new Array(map[i].length).fill());
  }

  const [startI, startJ] = findInMap(map, "S");
  calculateScoreForCell(map, startI, startJ, scoreMap, 0, 1);

  const [endI, endJ] = findInMap(map, "E");
  const endScore = scoreMap[endI][endJ];
  scoreMap.forEach((line) => {
    console.log(line.join(","), "\n");
  });

  console.timeEnd();
  console.log("end score", endScore);
  return endScore;
}

async function part2() {
  const map = await parseFile();
  console.time("part2");
  const scoreMap = {};

  const bestScore = await part1();
  console.log("BEST SCORE", bestScore);

  const [startI, startJ] = findInMap(map, "S");
  const paths = [];
  bestPaths(map, startI, startJ, scoreMap, 0, 1, false, [], paths, bestScore);
  const [endI, endJ] = findInMap(map, "E");
  console.log(paths);

  const uniqueCells = new Set(paths.flat());
  console.log(uniqueCells.size);

  console.timeEnd("part2");
  // console.log("end score", endScore);
  // return endScore;
}

// part1();
part2();

// answers
// 1: 143580 (100ms)
// 2: 645 (2s)
