import run from 'aocrunner';
import {impossible} from '../utils/index.js';

const parseInput = (rawInput: string) => rawInput.split('\n');

const parseRow = (row: string) =>
  (row.match(/(\d+)-(\d+),(\d+)-(\d+)/) || impossible()).slice(1).map((val) => parseInt(val));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((acc, row) => {
    const [a1, a2, b1, b2] = parseRow(row);

    return (a1 >= b1 && a2 <= b2) || (b1 >= a1 && b2 <= a2) ? acc + 1 : acc;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((acc, row) => {
    const [a1, a2, b1, b2] = parseRow(row);

    return a1 <= b2 && b1 <= a2 ? acc + 1 : acc;
  }, 0);
};

const testInput = `
  2-4,6-8
  2-3,4-5
  5-7,7-9
  2-8,3-7
  6-6,4-6
  2-6,4-8
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
