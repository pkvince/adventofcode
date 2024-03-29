import run from 'aocrunner';

const parseInput = (rawInput: string) =>
  rawInput
    .replace(/  +/g, ' ')
    .split('\n')
    .map((row) => row.split(': ')[1].trim());

const checkCardPoints = (card: string): number => {
  const winningNumbers = new Set(card.split(' | ')[0].split(' '));
  const myNumbers = new Set(card.split(' | ')[1].split(' '));
  return new Set([...myNumbers].filter((x) => winningNumbers.has(x))).size;
};

const part1 = (rawInput: string) => {
  const cards = parseInput(rawInput);

  let sum = 0;
  for (const card of cards) {
    const points = checkCardPoints(card);

    sum = sum + (points > 0 ? Math.pow(2, points - 1) : 0);
  }

  return sum;
};

const part2 = (rawInput: string) => {
  const cards = parseInput(rawInput);

  const cardCopies: Record<number, number> = cards.reduce((acc, curr, index) => {
    return {
      ...acc,
      [index + 1]: 1,
    };
  }, {});

  const cardPointsCache: Record<number, number> = {};

  let totalScratchcards = 0;
  cards.forEach((card, index) => {
    while (cardCopies[index + 1] > 0) {
      totalScratchcards++;
      cardCopies[index + 1] = cardCopies[index + 1] - 1;

      let points = cardPointsCache[index + 1] ?? null;

      if (points === null) {
        points = checkCardPoints(card);
        cardPointsCache[index + 1] = points;
      }

      if (points === 0) continue;

      for (let j = 1; j <= points; j++) {
        cardCopies[index + 1 + j] = cardCopies[index + 1 + j] + 1;
      }
    }
  });

  return totalScratchcards;
};

run({
  part1: {
    tests: [
      {
        input: `
          Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
          Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
          Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
          Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
          Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
          Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
       `,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
          Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
          Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
          Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
          Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
          Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
        `,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
