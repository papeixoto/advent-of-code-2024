// https://adventofcode.com/2024/day/15

const fs = require("node:fs/promises");

async function parseFile() {
  const file = await fs.readFile("input.txt", "utf-8");
  const lines = file.split("\n").map((line) => line.split(""));
  const map = [];
  const instructions = [];

  lines.forEach((line) => {
    if (!line.length) return;
    if (line[0] === "#") map.push(line);
    else instructions.push(...line);
  });

  return [map, instructions];
}

function findRobot(map) {
  let guardI, guardJ;
  map.forEach((line, i) =>
    line.forEach((cell, j) => {
      if (cell === "@") {
        guardI = i;
        guardJ = j;
      }
    })
  );

  return [guardI, guardJ];
}

function move1DRight(line, guardI) {
  let spaceI;

  for (let i = guardI; i < line.length; i++) {
    if (line[i] === "#") break;
    if (line[i] === ".") {
      spaceI = i;
      line.splice(spaceI, 1);
      line.splice(guardI, 0, ".");
      break;
    }
  }

  return line;
}

function move(map, instruction) {
  const [guardI, guardJ] = findRobot(map);
  const height = map.length;
  const width = map[0].length;

  let oldLine, newLine;
  switch (instruction) {
    case "^":
      oldLine = map.map((line) => line[guardJ]).reverse();
      newLine = move1DRight(oldLine, height - guardI - 1);
      newLine.reverse();
      map.forEach((line, i) => (line[guardJ] = newLine[i]));
      break;
    case ">":
      oldLine = [...map[guardI]];
      newLine = move1DRight(oldLine, guardJ);
      map[guardI] = newLine;
      break;
    case "v":
      oldLine = map.map((line) => line[guardJ]);
      newLine = move1DRight(oldLine, guardI);
      map.forEach((line, i) => (line[guardJ] = newLine[i]));
      break;
    case "<":
      oldLine = [...map[guardI]].reverse();
      newLine = move1DRight(oldLine, width - guardJ - 1);
      map[guardI] = newLine.reverse();
      break;
    default:
  }
}

function calculateMapGPS(map, char) {
  let acc = 0;
  map.forEach((line, i) =>
    line.forEach((cell, j) => {
      if (cell === char) {
        acc += 100 * i + j;
      }
    })
  );

  return acc;
}

async function part1() {
  const [map, instructions] = await parseFile();
  console.time();

  instructions.forEach((instruction, i) => {
    move(map, instruction);
  });

  const sum = calculateMapGPS(map, "O");
  console.timeEnd();
  console.log(sum);
  return sum;
}

function convertMapToWide(map) {
  const newMap = new Array(map.length);

  map.forEach((line, i) => {
    newMap[i] = [];
    line.forEach((cell) => {
      if (cell === "@") {
        newMap[i].push("@", ".");
        return;
      }
      if (cell === "O") {
        newMap[i].push("[", "]");
        return;
      }
      newMap[i].push(cell, cell);
    });
  });

  return newMap;
}

function moveBoxWide(map, guardI, guardJ, isUp) {
  const i = isUp ? -1 : +1;
  let canMoveBox = true;

  if (map[guardI + i][guardJ] === "[") {
    canMoveBox = moveBoxWide(map, guardI + i, guardJ, isUp) && canMoveBox;
  }

  if (map[guardI + i][guardJ] === "]") {
    canMoveBox = moveBoxWide(map, guardI + i, guardJ - 1, isUp) && canMoveBox;
  }

  if (map[guardI + i][guardJ + 1] === "[") {
    canMoveBox = moveBoxWide(map, guardI + i, guardJ + 1, isUp) && canMoveBox;
  }

  if (
    canMoveBox &&
    map[guardI + i][guardJ] === "." &&
    map[guardI + i][guardJ + 1] === "."
  ) {
    map[guardI + i][guardJ] = "[";
    map[guardI + i][guardJ + 1] = "]";
    map[guardI][guardJ] = ".";
    map[guardI][guardJ + 1] = ".";
  } else {
    canMoveBox = false;
  }

  return canMoveBox;
}

function moveWide(map, instruction) {
  const [guardI, guardJ] = findRobot(map);
  const height = map.length;
  const width = map[0].length;

  let oldLine, newLine;
  const mapCopy = JSON.parse(JSON.stringify(map));
  let canMoveBox = false;
  switch (instruction) {
    case "^":
      if (map[guardI - 1][guardJ] === "[") {
        canMoveBox = moveBoxWide(mapCopy, guardI - 1, guardJ, true);
      } else if (map[guardI - 1][guardJ] === "]") {
        canMoveBox = moveBoxWide(mapCopy, guardI - 1, guardJ - 1, true);
      }
      if (canMoveBox) map = mapCopy;
      if (map[guardI - 1][guardJ] === ".") {
        map[guardI - 1][guardJ] = "@";
        map[guardI][guardJ] = ".";
      }
      break;
    case ">":
      oldLine = [...map[guardI]];
      newLine = move1DRight(oldLine, guardJ);
      map[guardI] = newLine;
      break;
    case "v":
      if (map[guardI + 1][guardJ] === "[") {
        canMoveBox = moveBoxWide(mapCopy, guardI + 1, guardJ, false);
      } else if (map[guardI + 1][guardJ] === "]") {
        canMoveBox = moveBoxWide(mapCopy, guardI + 1, guardJ - 1, false);
      }
      if (canMoveBox) map = mapCopy;
      if (map[guardI + 1][guardJ] === ".") {
        map[guardI + 1][guardJ] = "@";
        map[guardI][guardJ] = ".";
      }
      break;
    case "<":
      oldLine = [...map[guardI]].reverse();
      newLine = move1DRight(oldLine, width - guardJ - 1);
      map[guardI] = newLine.reverse();
      break;
    default:
  }

  return map;
}

async function part2() {
  const [smallMap, instructions] = await parseFile();
  console.time();
  let map = convertMapToWide(smallMap);

  instructions.forEach((instruction, i) => {
    map = moveWide(map, instruction);
    // console.log("MOVE ", i, instruction);
    // map.forEach((line) => console.log(line.join(""), "\n"));
  });

  const sum = calculateMapGPS(map, "[");
  console.timeEnd();
  console.log(sum);
  return sum;
}

// part1();
part2();

// answers
// 1: 1465152 (71ms)
// 2:
