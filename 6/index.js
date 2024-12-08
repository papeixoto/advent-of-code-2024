// https://adventofcode.com/2024/day/6

const fs = require("node:fs/promises");

async function parseFile() {
  const file = await fs.readFile("input.txt", "utf-8");
  const lines = file.split("\n");
  const matrix = lines.map((line) => line.split(""));

  return matrix;
}

const DIRECTION_UP = "up";
const DIRECTION_DOWN = "down";
const DIRECTION_RIGHT = "right";
const DIRECTION_LEFT = "left";

const DIRECTIONS = {
  [DIRECTION_UP]: {
    guardChar: "^",
    getNextCoords: (matrix, i, j) => {
      if (i - 1 < 0) return;
      return {
        i: i - 1,
        j,
      };
    },
    nextDirection: DIRECTION_RIGHT,
  },
  [DIRECTION_RIGHT]: {
    guardChar: ">",
    getNextCoords: (matrix, i, j) => {
      if (j + 1 >= matrix[i].length) return;
      return {
        i: i,
        j: j + 1,
      };
    },
    nextDirection: DIRECTION_DOWN,
  },
  [DIRECTION_DOWN]: {
    guardChar: "v",
    getNextCoords: (matrix, i, j) => {
      if (i + 1 >= matrix.length) return;
      return {
        i: i + 1,
        j,
      };
    },
    nextDirection: DIRECTION_LEFT,
  },
  [DIRECTION_LEFT]: {
    guardChar: "<",
    getNextCoords: (matrix, i, j) => {
      if (j - 1 < 0) return;
      return {
        i: i,
        j: j - 1,
      };
    },
    nextDirection: DIRECTION_UP,
  },
};
const GUARD_CHARS = Object.values(DIRECTIONS).map((dir) => dir.guardChar);

function findGuard(matrix) {
  let isGuardInTheMap = false;
  let x;
  let y;
  let direction;

  matrix.forEach((line, i) => {
    line.forEach((cell, j) => {
      const localDirection = Object.entries(DIRECTIONS).find(
        ([_, value]) => cell === value.guardChar
      );

      if (localDirection) {
        isGuardInTheMap = true;
        x = i;
        y = j;
        direction = localDirection[0];
      }
    });
  });

  return {
    isGuardInTheMap,
    coordinates: {
      i: x,
      j: y,
    },
    direction,
  };
}

let obstaclesData = Array.from(Array(130), () => new Array(130));

function moveGuard(matrix, i, j, direction, saveObstacles = false) {
  const nextCoords = DIRECTIONS[direction].getNextCoords(matrix, i, j);
  matrix[i][j] = "X";
  const status = {
    coordinates: nextCoords,
    direction,
  };

  // rotate
  if (matrix?.[nextCoords?.i]?.[nextCoords?.j] === "#") {
    const nextDir = DIRECTIONS[direction].nextDirection;
    // console.log("NEXT DIR ", nextCoords);
    // console.log("PREV ", obstaclesData);
    // if (saveObstacles) obstaclesData[nextCoords.i][nextCoords.j] = direction;
    // console.log("NEXT ", obstaclesData);
    matrix[i][j] = DIRECTIONS[nextDir].guardChar;
    guardDirection = nextDir;
    // console.log("obstaclesData[i][j] ", obstaclesData[i][j], direction);
    // if (obstaclesData[i][j] === direction) return true;
    status.coordinates = {
      i,
      j,
    };
    status.direction = nextDir;
  } else {
    // just move guard
    try {
      matrix[nextCoords?.i][nextCoords?.j] = DIRECTIONS[direction].guardChar;
    } catch (e) {
      // console.log(e);
    }
  }
  return status;
}

// performance could be improved by checking the next "#" and doing that whole path
async function part1() {
  const mapMatrix = await parseFile();
  const height = mapMatrix.length;
  const width = mapMatrix[0].length;

  console.time();
  let guardStatus = findGuard(mapMatrix);

  do {
    guardStatus = moveGuard(
      mapMatrix,
      guardStatus.coordinates.i,
      guardStatus.coordinates.j,
      guardStatus.direction
    );
  } while (
    guardStatus?.coordinates?.i >= 0 &&
    guardStatus?.coordinates?.i < height &&
    guardStatus?.coordinates?.j >= 0 &&
    guardStatus?.coordinates?.j < width
  );

  let acc = 0;
  mapMatrix.forEach((line) =>
    line.forEach((cell) => {
      if (cell === "X") acc += 1;
    })
  );
  console.timeEnd();

  console.log("acc ", acc);
  return acc;
}

function isValidPathBetweenObstacles(vTopRight, vBotLeft, matrix) {
  const i1 = vTopRight.i;
  const j1 = vTopRight.j - 1;

  const i2 = vBotLeft.i;
  const j2 = vBotLeft.j + 1;

  if (i1 < 0 || i2 < 0 || i1 >= matrix.length || i2 >= matrix.length) {
    return false;
  }

  if (j1 < 0 || j2 < 0 || j1 >= matrix[0].length || j2 >= matrix[0].length) {
    return false;
  }

  if (matrix[i1].slice(j2, j1).find((el) => el === "#")) {
    return false;
  }
  if (matrix[i2].slice(j2, j1).find((el) => el === "#")) {
    return false;
  }

  if (
    matrix
      .map((line) => line[j1])
      .slice(i1, i2)
      .find((el) => el === "#")
  ) {
    onsole.log("f5");
    return false;
  }

  if (
    matrix
      .map((line) => line[j2])
      .slice(i1, i2)
      .find((el) => el === "#")
  ) {
    return false;
  }

  return true;
}

async function calculateNumberOfStuckInLoopObstacles() {
  const matrix = await parseFile();

  let guardStatus = findGuard(matrix);
  let prevObstacle = {
    i: undefined,
    j: undefined,
  };
  const obstacles = [];

  while (guardStatus?.isGuardInTheMap) {
    const { direction, coordinates } = guardStatus;
    const { i, j } = coordinates;
    const nextCoords = DIRECTIONS[direction].getNextCoords(matrix, i, j);
    matrix[i][j] = "X";

    if (!nextCoords) break;
    let obstacleIndex1;
    let obstacleIndex2;

    if (matrix[nextCoords.i][nextCoords.j] === "#") {
      if (prevObstacle.i === undefined) {
        prevObstacle.i = nextCoords.i;
        prevObstacle.j = nextCoords.j;
      } else {
        // console.log("prev ", prevObstacle);
        // console.log("nextcoords ", nextCoords);

        // we were moving up and now rigth
        switch (direction) {
          case DIRECTION_UP:
            console.log("UP");
            console.log();
            obstacleIndex1 = matrix[i].slice(j).findIndex((el) => el === "#");
            if (
              obstacleIndex1 >= 0 &&
              isValidPathBetweenObstacles(
                { i, j: obstacleIndex1 },
                prevObstacle,
                matrix
              )
            ) {
              obstacleIndex1 += j;
              if (matrix[prevObstacle.i + 1][obstacleIndex1 - 1] !== "#")
                obstacles.push(`${prevObstacle.i + 1}-${obstacleIndex1 - 1}`);
            }

            obstacleIndex2 = matrix?.[prevObstacle.i + 1]
              .slice(j)
              .findIndex((el) => el === "#");
            if (
              obstacleIndex2 >= 0 &&
              isValidPathBetweenObstacles(
                { i, j: obstacleIndex2 + 1 },
                prevObstacle,
                matrix
              ) &&
              matrix[i][obstacleIndex2 + 1] !== "#"
            )
              obstacles.push(`${i}-${obstacleIndex2 + 1}`);

            break;
          case DIRECTION_RIGHT:
            console.log("RIGHT");
            obstacleIndex1 = matrix
              .map((line) => line[j])
              .slice(i)
              .findIndex((el) => el === "#");

            console.log("obstacleIndex1", obstacleIndex1);
            if (
              obstacleIndex1 >= 0 &&
              isValidPathBetweenObstacles(
                nextCoords,
                { i: obstacleIndex1 + i - 1, j: prevObstacle.j - 1 },
                matrix
              ) &&
              matrix[obstacleIndex1 - 1][prevObstacle.j - 1] !== "#"
            ) {
              obstacleIndex1 += i;
              obstacles.push(`${obstacleIndex1 - 1}-${prevObstacle.j - 1}`);
            }

            obstacleIndex2 = matrix
              .map((line) => line?.[prevObstacle.j - 1])
              .slice(i)
              .findIndex((el) => el === "#");
            if (
              obstacleIndex2 >= 0 &&
              isValidPathBetweenObstacles(
                nextCoords,
                { i: obstacleIndex1 - 1, j: prevObstacle.j - 1 },
                matrix
              ) &&
              matrix[obstacleIndex2 + 1][j] !== "#"
            ) {
              obstacleIndex2 += i;
              obstacles.push(`${obstacleIndex2 + 1}-${j}`);
            }
            break;
          case DIRECTION_DOWN:
            console.log("down");
            console.log("position", { i, j });
            obstacleIndex1 = matrix[i]
              .slice(0, j)
              .findLastIndex((el) => el === "#");

            if (
              obstacleIndex1 >= 0 &&
              isValidPathBetweenObstacles(
                prevObstacle,
                { i: i, j: obstacleIndex1 },
                matrix
              ) &&
              matrix[prevObstacle.i - 1][obstacleIndex1 + 1] !== "#"
            ) {
              obstacles.push(`${prevObstacle.i - 1}-${obstacleIndex1 + 1}`);
              console.log(obstacleIndex1);
            }

            obstacleIndex2 = matrix?.[prevObstacle.i - 1]
              .slice(0, j)
              .findLastIndex((el) => el === "#");
            console.log(obstacleIndex2);
            if (
              obstacleIndex2 >= 0 &&
              isValidPathBetweenObstacles(
                prevObstacle,
                { i: i, j: obstacleIndex2 - 1 },
                matrix
              ) &&
              matrix[i][obstacleIndex2 - 1] !== "#"
            )
              obstacles.push(`${i}-${obstacleIndex2 - 1}`);
            break;
          case DIRECTION_LEFT:
            console.log("left");
            console.log("nextcoors ", nextCoords);
            obstacleIndex1 = matrix
              .map((line) => line[j])
              .slice(0, i)
              .findLastIndex((el) => el === "#");
            if (
              obstacleIndex1 >= 0 &&
              isValidPathBetweenObstacles(
                { i: obstacleIndex1 + 1, j: prevObstacle.j + 1 },
                nextCoords,
                matrix
              ) &&
              matrix[obstacleIndex1 + 1][prevObstacle.j + 1] !== "#"
            )
              obstacles.push(`${obstacleIndex1 + 1}-${prevObstacle.j + 1}`);

            obstacleIndex2 = matrix
              .map((line) => line?.[j + 1])
              .slice(0, i)
              .findLastIndex((el) => el === "#");
            console.log("YO CRL ", obstacleIndex2);

            if (
              obstacleIndex2 >= 0 &&
              isValidPathBetweenObstacles(
                {
                  i: obstacleIndex2,
                  j: prevObstacle.j + 1,
                },
                nextCoords,
                matrix
              ) &&
              matrix[obstacleIndex2 - 1][j] !== "#"
            )
              obstacles.push(`${obstacleIndex2 - 1}-${j}`);
            break;
          default:
            break;
        }

        prevObstacle.i = nextCoords.i;
        prevObstacle.j = nextCoords.j;
      }
      console.log("LOCAL ACC ", obstacles);

      const nextDir = DIRECTIONS[direction].nextDirection;
      matrix[i][j] = DIRECTIONS[nextDir].guardChar;
    } else {
      // console.log("moving the guard");
      // console.log("matrix before ", matrix);
      // console.log("new guard char ", DIRECTIONS[direction].guardChar);
      // just move guard
      matrix[nextCoords.i][nextCoords.j] = DIRECTIONS[direction].guardChar;
      // console.log("matrix after", matrix);
    }

    guardStatus = findGuard(matrix);
    // console.log("guardStatus ", guardStatus);
  }
  // console.log("fora do while");

  const uniqueObstacles = new Map(obstacles.map((el) => [el, 1]));
  // console.log("banana ", uniqueObstacles);
  return obstacles;
}

async function bruteForce() {
  const mapMatrix = await parseFile();

  console.time("start");
  const height = mapMatrix.length;
  const width = mapMatrix[0].length;
  let initialGuardStatus = findGuard(mapMatrix);
  let guardStatus = initialGuardStatus;

  do {
    guardStatus = moveGuard(
      mapMatrix,
      guardStatus.coordinates.i,
      guardStatus.coordinates.j,
      guardStatus.direction
    );
  } while (
    guardStatus?.coordinates?.i >= 0 &&
    guardStatus?.coordinates?.i < height &&
    guardStatus?.coordinates?.j >= 0 &&
    guardStatus?.coordinates?.j < width
  );

  guardStatus;
  let acc = 0;

  mapMatrix[initialGuardStatus.coordinates.i][
    initialGuardStatus.coordinates.j
  ] = DIRECTIONS[initialGuardStatus.direction].guardChar;

  mapMatrix.forEach((line, i) => {
    line.forEach((cell, j) => {
      console.time();
      // console.log("checking ", i, j, cell);
      if (cell !== "X") return;
      guardStatus = findGuard(mapMatrix);
      let localMapMatrix = mapMatrix.map((el) => el.slice());
      localMapMatrix[i][j] = "#";
      // console.log("localMapMatrix ", localMapMatrix);
      let loop = false;
      let numberOfMoves = 0;
      do {
        guardStatus = moveGuard(
          localMapMatrix,
          guardStatus.coordinates.i,
          guardStatus.coordinates.j,
          guardStatus.direction
        );
        numberOfMoves += 1;
      } while (
        guardStatus?.coordinates?.i >= 0 &&
        guardStatus?.coordinates?.i < height &&
        guardStatus?.coordinates?.j >= 0 &&
        guardStatus?.coordinates?.j < width &&
        numberOfMoves < 10000
      );
      if (numberOfMoves === 10000) {
        console.log("FOUND ", i, j);
        acc += 1;
        loop = false;
      }
      console.timeEnd();
    });
  });
  console.timeEnd("start");
  console.log("acc ", acc);
  console.log("obstacles ", obstaclesData);
  return acc;
}

// part1();
// calculateNumberOfStuckInLoopObstacles();
bruteForce();

// answers
// 1: 5095
// 2: 1933
