// https://adventofcode.com/2024/day/14

const fs = require("node:fs/promises");

async function parseFile() {
  const file = await fs.readFile("input.txt", "utf-8");
  const numRegex = /-?([0-9])+/g;
  const numInstances = file.match(numRegex);

  const robots = [];
  for (let i = 0; i < numInstances.length; i += 4) {
    const robot = {
      pos: {
        x: Number(numInstances[i]),
        y: Number(numInstances[i + 1]),
      },
      v: {
        x: Number(numInstances[i + 2]),
        y: Number(numInstances[i + 3]),
      },
    };
    robots.push(robot);
  }

  return robots;
}

function move(robot, moves, height, width) {
  const { pos, v } = robot;

  let newX = (pos.x + v.x * moves) % width;
  let newY = (pos.y + v.y * moves) % height;
  if (newX < 0) newX = newX + width;
  if (newY < 0) newY = newY + height;

  return [newX, newY];
}

function getSafetyFactor(positions, height, width) {
  const topLeft = {
    x: {
      min: 0,
      max: Math.floor(width / 2) - 1,
    },
    y: {
      min: 0,
      max: Math.floor(height / 2) - 1,
    },
  };

  const topRight = {
    x: {
      min: Math.ceil(width / 2),
      max: width - 1,
    },
    y: {
      min: 0,
      max: Math.floor(height / 2) - 1,
    },
  };

  const botLeft = {
    x: {
      min: 0,
      max: Math.floor(width / 2) - 1,
    },
    y: {
      min: Math.ceil(height / 2),
      max: height - 1,
    },
  };

  const botRight = {
    x: {
      min: Math.ceil(width / 2),
      max: width - 1,
    },
    y: {
      min: Math.ceil(height / 2),
      max: height - 1,
    },
  };

  const quadrants = [topLeft, topRight, botLeft, botRight];
  const quadrantScore = [0, 0, 0, 0];

  positions.forEach((pos) => {
    quadrants.forEach((q, i) => {
      const [x, y] = pos;
      if (x >= q.x.min && x <= q.x.max && y >= q.y.min && y <= q.y.max) {
        quadrantScore[i] = quadrantScore[i] + 1;
      }
    });
  });

  return (
    quadrantScore[0] * quadrantScore[1] * quadrantScore[2] * quadrantScore[3]
  );
}

async function part1() {
  const robots = await parseFile();
  const height = 103;
  const width = 101;
  const numMoves = 100;
  console.time();

  let newPos = [];
  robots.forEach((robot) => {
    newPos.push(move(robot, numMoves, height, width));
  });
  const safetyFactor = getSafetyFactor(newPos, height, width);

  console.log(safetyFactor);
  console.timeEnd();
  return safetyFactor;
}

async function printMap(positions, width, height, loopNum) {
  const result = Array.from({ length: height }, () =>
    new Array(width).fill(" ")
  );

  positions.forEach(([x, y]) => {
    result[y][x] = "#";
  });

  let toPrint = `-------------${loopNum}-------------\n`;
  result.forEach((line) => {
    toPrint += line.join("") + "\n";
  });

  await fs.writeFile("./result.txt", toPrint, { flag: "a+" });

  console.log(toPrint);
}

async function part2() {
  const robots = await parseFile();
  const width = 101;
  const height = 103;
  // const width = 11;
  // const height = 7;
  console.time();

  let newPos = [];
  let numOfMoves = 0;
  while (numOfMoves < 10000) {
    numOfMoves++;
    newPos = [];
    robots.forEach((robot) => {
      const newRobotPos = move(robot, 1, height, width);
      newPos.push(newRobotPos);
      robot.pos.x = newRobotPos[0];
      robot.pos.y = newRobotPos[1];
    });
    // console.log("newPos ", newPos);

    await printMap(newPos, width, height, numOfMoves);
  }

  console.timeEnd();
}

// part1();
part2();

// answers
// 1: 211692000 (5ms)
// 2:
