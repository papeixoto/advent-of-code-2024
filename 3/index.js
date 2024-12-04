// https://adventofcode.com/2024/day/3

// Let's use a regex to extract all the mul instructions since they seem to be
//  well writen from beggining to end, just with trash between the calls
// I used this to help me with the regex: https://regexr.com/
// Regex used:  /mul\([0-9]{1,3},[0-9]{1,3}\)/g
// meaning:
// / - open - indicates the start of a regular expression
// mul - matches the mull string
// \( - matches the "(" char
// [] - character set. matches any character in the set
// 0-9 - matches chars from 0 to 9 (all numbers)
// {1-3} - quantifier
// , - matches the "," char
// \) - matches the ")" char
// / - close - indicates the end of the regular expression
// g - global search. allows iterative search
const fs = require("node:fs/promises");

async function parseCorruptedFile() {
  const file = await fs.readFile("input.txt", "utf-8");
  const mulMatchingRegex = /mul\([0-9]{1,3},[0-9]{1,3}\)/g;
  const mulInstances = file.match(mulMatchingRegex);

  const numberRegex = /[0-9]{1,3}/g;
  let acc = 0;
  mulInstances.forEach((mul) => {
    const [firstNumber, secondNumber] = mul.match(numberRegex);
    acc += firstNumber * secondNumber;
  });

  console.log(acc);
  return acc;
}

const INSTRUCTIONS = {
  MUL: "MUL",
  ENABLE: "ENABLE",
  DISABLE: "disable",
};

async function parseCorruptedFileWithConditionals() {
  let file = await fs.readFile("input.txt", "utf-8");
  const mulMatchingRegex = /mul\([0-9]{1,3},[0-9]{1,3}\)/;
  const numberRegex = /[0-9]{1,3}/g;
  const enableMatchingRegex = /do\(\)/;
  const disableMatchingRegex = /don't\(\)/;

  let acc = 0;
  let enabled = true;
  while (file.length) {
    const mulInstance = mulMatchingRegex.exec(file);
    const enableInstance = enableMatchingRegex.exec(file);
    const disableInstance = disableMatchingRegex.exec(file);
    const mulIndex = mulInstance?.index ?? Number.MAX_SAFE_INTEGER;
    const enableIndex = enableInstance?.index ?? Number.MAX_SAFE_INTEGER;
    const disableIndex = disableInstance?.index ?? Number.MAX_SAFE_INTEGER;

    let nextInstruction;
    if (mulIndex < enableIndex && mulIndex < disableIndex) {
      nextInstruction = INSTRUCTIONS.MUL;
    } else if (enableIndex < disableIndex) {
      nextInstruction = INSTRUCTIONS.ENABLE;
    } else if (disableIndex < enableIndex) {
      // doing this conditional because we don't want to have an instruction by default
      // if we don't have any instruction we can end the loop
      nextInstruction = INSTRUCTIONS.DISABLE;
    }

    switch (nextInstruction) {
      case INSTRUCTIONS.MUL:
        if (enabled) {
          const [firstNumber, secondNumber] = mulInstance[0].match(numberRegex);
          acc += firstNumber * secondNumber;
        }
        file = file.substring(mulIndex + mulInstance[0].length);
        break;
      case INSTRUCTIONS.ENABLE:
        enabled = true;
        file = file.substring(enableIndex + enableInstance[0].length);
        break;
      case INSTRUCTIONS.DISABLE:
        enabled = false;
        file = file.substring(disableIndex + disableInstance[0].length);
        break;
      default:
        file = [];
        break;
    }
  }

  console.log("acc ", acc);
  return acc;
}

// parseCorruptedFile();
// parseCorruptedFileWithConditionals();

// answers:
// 1: 184122457
