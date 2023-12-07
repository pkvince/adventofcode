import run from 'aocrunner';

const parseInput = (rawInput: string) =>
  rawInput
    .replace(/\s\s+/g, ' ')
    .split('\n')
    .map((row) => row.split(': ')[1].split(' ').map(Number));

const parseInput2 = (rawInput: string) =>
  rawInput
    .replace(/\s\s+/g, ' ')
    .split('\n')
    .map((row) => Number(row.split(': ')[1].replace(/\s/g, '')));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  console.log(input);

  let possibleWays = [];
  for (let i = 0; i < input[0].length; i++) {
    console.log('Race', i);
    const time = input[0][i];
    const distance = input[1][i];

    let count = 0;
    for (let timeHeld = 1; timeHeld < time; timeHeld++) {
      const speed = timeHeld; // mm/ms
      const distanceTravelled = speed * (time - timeHeld);

      if (distanceTravelled > distance) {
        count++;
      }
    }
    possibleWays.push(count);
  }

  return possibleWays.reduce((a, b) => a * b, 1);
};

const part2 = (rawInput: string) => {
  const input = parseInput2(rawInput);

  const time = input[0];
  const distance = input[1];

  let count = 0;
  for (let timeHeld = 1; timeHeld < time; timeHeld++) {
    const speed = timeHeld; // mm/ms
    const distanceTravelled = speed * (time - timeHeld);

    if (distanceTravelled > distance) {
      count++;
    }
  }

  return count;
};

run({
  part1: {
    tests: [
      {
        input: `
          Time:      7  15   30
          Distance:  9  40  200
        `,
        expected: 288,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Time:      7  15   30
          Distance:  9  40  200
        `,
        expected: 71503,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
