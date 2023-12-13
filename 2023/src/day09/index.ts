import run from 'aocrunner';

const parseInput = (rawInput: string) =>
  rawInput.split('\n').map((line) => line.split(' ').map(Number));

const tail = <T>(arr: T[]): T => arr[arr.length - 1];

const part1 = (rawInput: string) => {
  const historyLines = parseInput(rawInput);

  let sum = 0;
  for (const history of historyLines) {
    let stepStack: number[][] = [];
    stepStack.push(history);
    while (tail(stepStack).some((v) => v !== 0)) {
      const current = tail(stepStack);
      const next = current.reduce<number[]>((acc, v, i) => {
        if (i === 0) return acc;
        return [...acc, v - current[i - 1]];
      }, []);
      stepStack.push(next);
    }

    let lastNumber = 0;
    while (stepStack.length >= 1) {
      const current = stepStack.pop()!;
      lastNumber += current[current.length - 1];
    }
    sum += lastNumber;
  }

  return sum;
};

const part2 = (rawInput: string) => {
  const historyLines = parseInput(rawInput);

  let sum = 0;
  for (const history of historyLines) {
    let stepStack: number[][] = [];
    stepStack.push(history);
    while (tail(stepStack).some((v) => v !== 0)) {
      const current = tail(stepStack);
      const next = current.reduce<number[]>((acc, v, i) => {
        if (i === 0) return acc;
        return [...acc, v - current[i - 1]];
      }, []);
      stepStack.push(next);
    }

    let firstNumber = 0;
    while (stepStack.length >= 1) {
      const current = stepStack.pop()!;
      firstNumber = current[0] - firstNumber;
    }
    sum += firstNumber;
  }

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `
          0 3 6 9 12 15
          1 3 6 10 15 21
          10 13 16 21 30 45
        `,
        expected: 114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          0 3 6 9 12 15
          1 3 6 10 15 21
          10 13 16 21 30 45
        `,
        expected: 2,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
