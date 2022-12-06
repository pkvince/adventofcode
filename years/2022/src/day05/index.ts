import run from 'aocrunner';
import {impossible} from '../utils/index.js';

const parseInput = (rawInput: string) => {
  const [rawStacks, rawMoves] = rawInput.split('\n\n');

  const rawStacksRows = rawStacks.split('\n');
  let stacks: string[][] = [];
  for (let i = rawStacksRows.length - 2; i >= 0; i--) {
    // Every row of raw input from the bottom
    const rowOfCrates = rawStacksRows[i];

    for (let j = 1; j <= rowOfCrates.length; j += 4) {
      const stackIndex = (j + 3) / 4 - 1;
      if (rowOfCrates[j] === ' ') continue;
      if (!stacks[stackIndex]) stacks[stackIndex] = [];
      stacks[stackIndex].push(rowOfCrates[j]);
    }
  }

  return {
    stacks,
    moves: rawMoves.split('\n').map((move) => {
      const [qty, from, to] = (move.match(/move (\d+) from (\d+) to (\d+)/) ?? impossible())
        .slice(1)
        .map((num) => parseInt(num));
      return {qty, from, to};
    }),
  };
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const outputStacks = input.stacks;
  input.moves.forEach((move) => {
    for (let i = 0; i < move.qty; i++) {
      const crate = outputStacks[move.from - 1].pop() ?? impossible();
      outputStacks[move.to - 1].push(crate);
    }
  });

  return outputStacks.reduce((acc, stack) => (acc += stack.pop()), '');
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const outputStacks = input.stacks;
  input.moves.forEach((move) => {
    const srcStack = outputStacks[move.from - 1];
    const dstStack = outputStacks[move.to - 1];
    const newStack = srcStack.slice(0, srcStack.length - move.qty);
    const movedCrates = srcStack.slice(srcStack.length - move.qty);

    outputStacks[move.from - 1] = newStack;
    outputStacks[move.to - 1] = [...dstStack, ...movedCrates];
  });

  return outputStacks.reduce((acc, stack) => (acc += stack.pop()), '');
};

const testInput = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 'CMZ',
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 'MCD',
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
