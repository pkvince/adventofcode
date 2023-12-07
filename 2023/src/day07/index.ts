import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n').map((row) => row.split(' '));

const cardValues: Record<string, number> = {
  '*': 0, // Jokers ("J" replaced with "*" in part 2)
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  'T': 10,
  'J': 11,
  'Q': 12,
  'K': 13,
  'A': 14,
};

enum PokerHand {
  HighCard,
  OnePair,
  TwoPairs,
  ThreeOfAKind,
  FullHouse,
  FourOfAKind,
  FiveOfAKind,
}

const cardOccurences = (cards: string) => {
  return cards.split('').reduce((acc, card) => {
    const cardValue = cardValues[card];
    acc[cardValue] = acc[cardValue] ? acc[cardValue] + 1 : 1;
    return acc;
  }, {} as Record<number, number>);
};

const evaluateHand = (cards: string, withJokers: boolean = false): PokerHand => {
  const occurences = cardOccurences(cards);

  if (withJokers) {
    const jokeyValue = cardValues['*'];
    const jokersCount = occurences[jokeyValue] ?? 0;
    delete occurences[jokeyValue];

    const jokerCandidateCards = Object.keys(occurences)
      .map(Number)
      .sort((a, b) => {
        // First sort by occurences value
        if (occurences[a] !== occurences[b]) {
          return occurences[b] - occurences[a];
        }

        // Then by card value
        return a - b;
      });

    if (jokerCandidateCards.length === 0) {
      occurences[cardValues['A']] = jokersCount;
    }

    occurences[jokerCandidateCards[0]] = occurences[jokerCandidateCards[0]] + jokersCount;
  }

  const occurencesValues = Object.values(occurences);

  if (occurencesValues.includes(5)) {
    return PokerHand.FiveOfAKind;
  }

  if (occurencesValues.includes(4)) {
    return PokerHand.FourOfAKind;
  }

  if (occurencesValues.includes(3) && occurencesValues.includes(2)) {
    return PokerHand.FullHouse;
  }

  if (occurencesValues.includes(3)) {
    return PokerHand.ThreeOfAKind;
  }

  if (occurencesValues.filter((occurence) => occurence === 2).length === 2) {
    return PokerHand.TwoPairs;
  }

  if (occurencesValues.includes(2)) {
    return PokerHand.OnePair;
  }

  return PokerHand.HighCard;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const sortedHands = input.sort((a, b) => {
    const handA = evaluateHand(a[0]);
    const handB = evaluateHand(b[0]);

    if (handA === handB) {
      for (let i = 0; i < a[0].length; i++) {
        const cardA = a[0][i];
        const cardB = b[0][i];

        if (cardA === cardB) {
          continue;
        }

        return cardValues[cardA] - cardValues[cardB];
      }
      return cardValues[a[0][0]] - cardValues[b[0][0]];
    }

    return handA - handB;
  });

  return sortedHands.reduce((acc, hand, index) => {
    return acc + Number(hand[1]) * (index + 1);
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput.replace(/J/g, '*'));

  const sortedHands = input.sort((a, b) => {
    const handA = evaluateHand(a[0], true);
    const handB = evaluateHand(b[0], true);

    if (handA === handB) {
      for (let i = 0; i < a[0].length; i++) {
        const cardA = a[0][i];
        const cardB = b[0][i];

        if (cardA === cardB) {
          continue;
        }

        return cardValues[cardA] - cardValues[cardB];
      }
      return cardValues[a[0][0]] - cardValues[b[0][0]];
    }

    return handA - handB;
  });

  return sortedHands.reduce((acc, hand, index) => {
    return acc + Number(hand[1]) * (index + 1);
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
          32T3K 765
          T55J5 684
          KK677 28
          KTJJT 220
          QQQJA 483
        `,
        expected: 6440,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          32T3K 765
          T55J5 684
          KK677 28
          KTJJT 220
          QQQJA 483
        `,
        expected: 5905,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
