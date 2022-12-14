import run from 'aocrunner';
import _ from 'lodash';
import {arraySum, impossible} from '../utils/index.js';

type DeepArray = (number | DeepArray)[];

const parseInput = (rawInput: string) =>
  rawInput
    .split('\n\n')
    .map((block) => block.split('\n').map((row) => JSON.parse(row) as DeepArray));

const areElementsInOrder = (
  left: DeepArray | number,
  right: DeepArray | number,
): boolean | undefined => {
  console.log('- Compare', left, 'vs', right);
  if (_.isNumber(left) && _.isNumber(right)) {
    return left === right ? undefined : left < right;
  }

  if (_.isArray(left) && _.isArray(right)) {
    // console.log('Both arrays!');

    while (left.length > 0 || right.length > 0) {
      const leftChild = left.slice(0, 1)[0];
      const rightChild = right.slice(0, 1)[0];
      if (!leftChild) {
        // console.log('left ran out of items, correct order');
        return true;
      }
      if (!rightChild) {
        // console.log('right ran out of items, incorrect order');
        return false;
      }

      const result = areElementsInOrder(leftChild!, rightChild!);
      if (_.isBoolean(result)) return result;

      return areElementsInOrder(left.slice(1), right.slice(1));
    }

    return undefined;
  }

  if (_.isNumber(left) !== _.isNumber(right)) {
    // console.warn('Mixed type!');
    if (_.isNumber(left)) return areElementsInOrder([left], right);
    else return areElementsInOrder(left, [right]);
  }

  return impossible();
};

const part1 = (rawInput: string) => {
  const pairs = parseInput(rawInput);

  let correctPairs: number[] = [];
  pairs.forEach(([left, right], i) => {
    if (areElementsInOrder(left, right)) {
      correctPairs.push(i + 1);
    }
  });

  return arraySum(correctPairs);
};

const part2 = (rawInput: string) => {
  const pairs = parseInput(rawInput);

  const signals = _.flatten([...pairs, [[[2]], [[6]]]]);

  const sortedSignals = signals.sort((a, b) => {
    return areElementsInOrder(a, b) ? -1 : 1;
  });

  let multiplier = 1;
  for (let i = 1; i <= sortedSignals.length; i++) {
    if (_.isEqual(sortedSignals[i - 1], [[2]]) || _.isEqual(sortedSignals[i - 1], [[6]])) {
      multiplier = multiplier * i;
    }
  }

  return multiplier;
};

const testInput = `
  [1,1,3,1,1]
  [1,1,5,1,1]

  [[1],[2,3,4]]
  [[1],4]

  [9]
  [[8,7,6]]

  [[4,4],4,4]
  [[4,4],4,4,4]

  [7,7,7,7]
  [7,7,7]

  []
  [3]

  [[[]]]
  [[]]

  [1,[2,[3,[4,[5,6,7]]]],8,9]
  [1,[2,[3,[4,[5,6,0]]]],8,9]
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 140,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
