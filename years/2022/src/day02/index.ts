import run from 'aocrunner';
import {arraySum} from '../utils/index.js';

type Round = 'A X' | 'A Y' | 'A Z' | 'B X' | 'B Y' | 'B Z' | 'C X' | 'C Y' | 'C Z';

const SCORES_PART_1: Record<Round, number> = {
  'A X': 4, // 🪨-🪨 = 3 + 1
  'A Y': 8, // 🪨-📄 = 6 + 2
  'A Z': 3, // 🪨-✂️ = 0 + 3
  'B X': 1, // 📄-🪨 = 0 + 1
  'B Y': 5, // 📄-📄 = 3 + 2
  'B Z': 9, // 📄-✂️ = 6 + 3
  'C X': 7, // ✂️-🪨 = 6 + 1
  'C Y': 2, // ✂️-📄 = 0 + 2
  'C Z': 6, // ✂️-✂️ = 3 + 3
};

const SCORES_PART_2: Record<Round, number> = {
  'A X': 3, // 🪨-✂️ = 0 + 3
  'A Y': 4, // 🪨-🪨 = 3 + 1
  'A Z': 8, // 🪨-📄 = 6 + 2
  'B X': 1, // 📄-🪨 = 0 + 1
  'B Y': 5, // 📄-📄 = 3 + 2
  'B Z': 9, // 📄-✂️ = 6 + 3
  'C X': 2, // ✂️-📄 = 0 + 2
  'C Y': 6, // ✂️-✂️ = 3 + 3
  'C Z': 7, // ✂️-🪨 = 6 + 1
};

const parseInput = (rawInput: string): Round[] => rawInput.split('\n') as Round[];

const part1 = (rawInput: string) => {
  const rounds = parseInput(rawInput);

  return arraySum(rounds.map((round) => SCORES_PART_1[round]));
};

const part2 = (rawInput: string) => {
  const rounds = parseInput(rawInput);

  return arraySum(rounds.map((round) => SCORES_PART_2[round]));
};

const testInput = `
  A Y
  B X
  C Z
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
