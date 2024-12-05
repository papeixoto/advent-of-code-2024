// https://adventofcode.com/2024/day/4

const fs = require("node:fs/promises");

async function parseFile() {
  const file = await fs.readFile("input.txt", "utf-8");
  const lines = file.split("\n");

  const rules = [];
  const updates = [];

  lines.forEach((line) => {
    if (line.includes("|")) {
      rules.push(line.split("|").map((el) => Number(el)));
    } else if (!!line) {
      updates.push(line.split(",").map((el) => Number(el)));
    }
  });

  return [rules, updates];
}

function isValidUpdate(update, rules) {
  let isValid = true;

  update.forEach((value, i) => {
    if (!isValid) return;
    if (i + 1 === update.length) return;
    // let's check the values after value to see if there's anything against it
    const restOfUpdate = update.slice(i + 1);
    restOfUpdate.forEach((el) => {
      if (!isValid) return;
      rules.find((rule) => {
        const [first, second] = rule;
        if (first === el && second === value) isValid = false;
      });
    });
  });

  return isValid;
}

async function sumMiddleOfCorrectUpdates() {
  const [rules, updates] = await parseFile();

  console.log(updates.length);

  let acc = 0;
  let valid = 0;
  updates.forEach((update) => {
    if (isValidUpdate(update, rules)) {
      valid += 1;
      // console.log(update[(update.length - 1) / 2]);
      acc += update[(update.length - 1) / 2];
    }
  });

  console.log("valid ", valid);
  console.log(acc);
  return acc;
}

function orderUpdate(update, rules) {
  update.sort((a, b) => {
    let sortReturn = 0;
    isABeforeB = rules.find((rule) => {
      const [first, second] = rule;
      if (first === a && second === b) sortReturn = -1;
      if (first === b && second === a) sortReturn = 1;
    });
    return sortReturn;
  });
}

async function orderIncorrectUpdatesAndSumMiddle() {
  const [rules, updates] = await parseFile();

  const incorrectUpdates = updates.filter(
    (update) => !isValidUpdate(update, rules)
  );

  let acc = 0;
  incorrectUpdates.forEach((update) => {
    orderUpdate(update, rules);
    acc += update[(update.length - 1) / 2];
  });

  console.log("acc ", acc);
  return acc;
}

// sumMiddleOfCorrectUpdates();
// orderIncorrectUpdatesAndSumMiddle();

// answers
// 1: 6951
// 2: 4121
