// doing a better memoization here

const fs = require("node:fs/promises");

async function parseFile() {
  const file = await fs.readFile("input.txt", "utf-8");
  const line = file.split(" ").map(Number);

  return line;
}

const cache = {};
function blink(stone, timesToRun) {
  if (timesToRun === 0) return 1;
  if (cache?.[`${stone}-${timesToRun}`]) return cache[`${stone}-${timesToRun}`];

  if (stone === 0) res = blink(1, timesToRun - 1);
  else {
    const stringStone = stone.toString();
    if (stringStone.length % 2 === 0) {
      const first = Number(stringStone.substring(0, stringStone.length / 2));
      const second = Number(
        stringStone.substring(stringStone.length / 2, stringStone.length)
      );
      res = blink(first, timesToRun - 1) + blink(second, timesToRun - 1);
    } else {
      res = blink(stone * 2024, timesToRun - 1);
    }
  }

  cache[`${stone}-${timesToRun}`] = res;
  // this is much slower 6ms vs 45ms
  // (cache[stone] = cache[stone] || {}).timesToRun = res;
  return res;
}

async function part2() {
  const stones = await parseFile();

  console.time();

  let acc = 0;
  stones.forEach((stone) => {
    acc += blink(stone, 75);
  });

  console.log(acc);
  console.timeEnd();

  return acc;
}

part2();
