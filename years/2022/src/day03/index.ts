import run from 'aocrunner';
import {arraySum, impossible} from '../utils/index.js';

const parseInput = (rawInput: string): string[] => rawInput.split('\n');

const getPriority = (c: string) => {
  const charCode = c.charCodeAt(0);

  // In unicode, 'a' is 97 and 'A' is 65
  return charCode >= 97 ? charCode - 96 : charCode - 64 + 26;
};

const part1 = (rawInput: string) => {
  const rucksacks = parseInput(rawInput);

  return arraySum(
    rucksacks.map((row) => {
      const firstCompartment = row.slice(0, row.length / 2);
      const secondCompartment = row.slice(row.length / 2);

      const wrongItem =
        firstCompartment.split('').find((item) => secondCompartment.includes(item)) ??
        impossible('Did not find any item present in both compartments');

      return getPriority(wrongItem);
    }),
  );
};

const part2 = (rawInput: string) => {
  const rucksacks = parseInput(rawInput);

  let sum = 0;
  for (let i = 0; i < rucksacks.length; i += 3) {
    const badge =
      rucksacks[i]
        .split('')
        .find((item) => rucksacks[i + 1].includes(item) && rucksacks[i + 2].includes(item)) ??
      impossible('Did not find common item present in all three bags');

    sum += getPriority(badge);
  }

  return sum;
};

const testInput = `
  vJrwpWtwJgWrhcsFMMfFFhFp
  jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
  PmmdzqPrVvPwwTWBwg
  wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
  ttgJtRGJQctTZtZT
  CrZsJsPPZsGzwwsLwLmpwMDw
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
