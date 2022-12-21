import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n').map((num) => parseInt(num));

const mixAndDecode = (input: number[], iterations = 1, multiplier = 1): number => {
  const listSize = input.length;

  let elements = input.map((v, i) => {
    return [i, v * multiplier];
  });

  const copyOfElements = [...elements];
  for (let iteration = 0; iteration < iterations; iteration++) {
    for (const element of copyOfElements) {
      const val = element[1];
      const i = elements.findIndex(([v, i]) => element[0] === v && element[1] === i);
      let target = (i + val) % (listSize - 1);
      elements.splice(i, 1);
      elements.splice(target, 0, element);
    }
  }

  const zIndex = elements.findIndex(([, v]) => v === 0);

  let sum = 0;
  [1000, 2000, 3000].forEach((i) => {
    sum += elements[(zIndex + i) % listSize][1];
  });

  return sum;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return mixAndDecode(input);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return mixAndDecode(input, 10, 811589153);
};

const testInput = `
  1
  2
  -3
  3
  -2
  0
  4
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 3,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 1623178306,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
