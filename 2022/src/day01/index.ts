import run from 'aocrunner';
import {arraySum} from '../utils/index.js';

const parseInput = (rawInput: string) => {
  const elves = rawInput.split('\n\n');

  return elves.map((elf) => elf.split('\n').map((row) => parseInt(row)));
};

const part1 = (rawInput: string) => {
  const elvesWithFood = parseInput(rawInput);
  const caloriesByElf = elvesWithFood.map((elf) => arraySum(elf));

  return Math.max(...caloriesByElf);
};

const part2 = (rawInput: string) => {
  const elvesWithFood = parseInput(rawInput);
  const caloriesByElf = elvesWithFood.map((elf) => arraySum(elf));

  // Top 3 with most calories
  return arraySum(caloriesByElf.sort((a, b) => b - a).slice(0, 3));
};

const testInput = `
  1000
  2000
  3000

  4000

  5000
  6000

  7000
  8000
  9000

  10000
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 24000,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 45000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
