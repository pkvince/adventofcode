import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

type Position = {
  distance: number;
  depth: number;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const {distance, depth} = input.reduce(
    (acc, instruction): Position => {
      const [direction, rawQuantity] = instruction.split(' ');
      const quantity = parseInt(rawQuantity);

      switch (direction) {
        case 'forward':
          return {...acc, distance: acc.distance + quantity};
        case 'down':
          return {...acc, depth: acc.depth + quantity};
        case 'up':
          return {...acc, depth: acc.depth - quantity};
        default:
          throw new Error(`Could not parse direction: ${direction}`);
      }
    },
    {distance: 0, depth: 0},
  );

  return distance * depth;
};

type PositionWithAim = {
  distance: number;
  depth: number;
  aim: number;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const {distance, depth, aim} = input.reduce(
    (acc, instruction): PositionWithAim => {
      const [direction, rawQuantity] = instruction.split(' ');
      const quantity = parseInt(rawQuantity);

      switch (direction) {
        case 'forward':
          return {...acc, distance: acc.distance + quantity, depth: acc.depth + quantity * acc.aim};
        case 'down':
          return {...acc, aim: acc.aim + quantity};
        case 'up':
          return {...acc, aim: acc.aim - quantity};
        default:
          throw new Error(`Could not parse direction: ${direction}`);
      }
    },
    {distance: 0, depth: 0, aim: 0},
  );

  return distance * depth;
};

const testInput = `
  forward 5
  down 5
  forward 8
  up 3
  down 8
  forward 2
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 150,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 900,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
