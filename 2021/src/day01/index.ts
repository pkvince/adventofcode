import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split('\n');

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let count = 0;
  for (let i = 1; i< input.length; i++) {
    if (parseInt(input[i]) > parseInt(input[i - 1])) count += 1;
  }

  return count;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let slidingWindowSums: number[] = [];
  for (let i = 0; i <= input.length; i++) {
    if (i >= 3) {
      slidingWindowSums[i - 3] = input.slice(i - 3, i).reduce((acc, val) => acc + parseInt(val), 0);
    }
  }

  let count = 0;
  for (let i = 1; i< slidingWindowSums.length; i++) {
    if (slidingWindowSums[i] > slidingWindowSums[i - 1]) count += 1;
  }

  return count;
};

const testInput = `
  199
  200
  208
  210
  200
  207
  240
  269
  260
  263
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 5,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
