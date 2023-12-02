import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n').map((row) => row.split(':')[1]);

const part1 = (rawInput: string) => {
  const games = parseInput(rawInput);

  let i = 1;
  let sum = 0;
  for (const game of games) {
    const redMatches = [...game.matchAll(/(\d+)\sred/g)];
    const greenMatches = [...game.matchAll(/(\d+)\sgreen/g)];
    const blueMatches = [...game.matchAll(/(\d+)\sblue/g)];

    const possible =
      redMatches.every(([, num]) => parseInt(num) <= 12) &&
      greenMatches.every(([, num]) => parseInt(num) <= 13) &&
      blueMatches.every(([, num]) => parseInt(num) <= 14);

    if (possible) sum += i;
    i++;
  }

  return sum;
};

const part2 = (rawInput: string) => {
  const games = parseInput(rawInput);

  let sum = 0;
  for (const game of games) {
    const redMatches = [...game.matchAll(/(\d+)\sred/g)];
    const greenMatches = [...game.matchAll(/(\d+)\sgreen/g)];
    const blueMatches = [...game.matchAll(/(\d+)\sblue/g)];

    const power =
      Math.max(...redMatches.map(([, num]) => parseInt(num))) *
      Math.max(...greenMatches.map(([, num]) => parseInt(num))) *
      Math.max(...blueMatches.map(([, num]) => parseInt(num)));

    sum += power;
  }

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `
          Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
          Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
          Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
          Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
          Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        `,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
          Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
          Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
          Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
          Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        `,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
