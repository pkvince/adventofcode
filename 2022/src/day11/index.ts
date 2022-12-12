import run from 'aocrunner';
import {impossible} from '../utils/index.js';

type Monkey = {
  items: number[];
  op: (worryLevel: number) => number;
  passTo: (item: number) => number;
  passToAndDivide: (item: number) => {passTo: number; item: number};
};

const Operations = {
  '+': (x: number, y: number) => x + y,
  '*': (x: number, y: number) => x * y,
};

const parseInput = (rawInput: string): Monkey[] =>
  rawInput.split('\n\n').map((rawMonkey) => {
    const lines = rawMonkey.split('\n');
    const items = lines[1]
      .split(': ')[1]
      .split(', ')
      .map((val) => parseInt(val));

    const operationParts = lines[2].match(/old (\+|\*) (old|\d+)/) ?? impossible();

    const op = (worryLevel: number) =>
      Operations[operationParts[1] as '*' | '+'](
        worryLevel,
        operationParts[2] === 'old' ? worryLevel : parseInt(operationParts[2]),
      );

    const divisibleBy = parseInt((lines[3].match(/(\d+)/) ?? impossible())[1]);
    const trueDest = parseInt((lines[4].match(/(\d+)/) ?? impossible())[1]);
    const falseDest = parseInt((lines[5].match(/(\d+)/) ?? impossible())[1]);
    const passTo = (item: number) => (item % divisibleBy === 0 ? trueDest : falseDest);
    const passToAndDivide = (item: number) =>
      item % divisibleBy === 0
        ? {passTo: trueDest, item: item / divisibleBy}
        : {passTo: falseDest, item};

    return {items, op, passTo, passToAndDivide};
  });

const part1 = (rawInput: string) => {
  const monkeys = parseInput(rawInput);

  const inspectionsByMonkey = Array.from({length: monkeys.length}, () => 0);
  Array.from({length: 20}, () => {
    for (let m = 0; m < monkeys.length; m++) {
      while (monkeys[m].items.length) {
        let item = monkeys[m].items.shift() ?? impossible();
        console.log(`Monkey ${m} inspecting item ${item}`);
        inspectionsByMonkey[m]++;
        item = monkeys[m].op(item);
        item = Math.floor(item / 3);
        const passTo = monkeys[m].passTo(item);
        console.log('Passing item', item, 'to monkey', passTo);
        monkeys[passTo].items.push(item);
      }
    }
  });

  console.log(inspectionsByMonkey.sort((a, b) => b - a).slice(0, 2));
  const topTwoMostActiveMonkeys = inspectionsByMonkey.sort((a, b) => b - a);

  return topTwoMostActiveMonkeys[0] * topTwoMostActiveMonkeys[1];
};

const part2 = (rawInput: string) => {
  const monkeys = parseInput(rawInput);

  const inspectionsByMonkey = Array.from({length: monkeys.length}, () => 0);
  Array.from({length: 10000}, () => {
    for (let m = 0; m < monkeys.length; m++) {
      while (monkeys[m].items.length) {
        let item = monkeys[m].items.shift() ?? impossible();
        console.log(`Monkey ${m} inspecting item ${item}`);
        inspectionsByMonkey[m]++;
        item = monkeys[m].op(item);
        const passToAndDivide = monkeys[m].passToAndDivide(item);
        console.log('Passing item', passToAndDivide.item, 'to monkey', passToAndDivide.passTo);
        monkeys[passToAndDivide.passTo].items.push(passToAndDivide.item);
      }
    }
  });

  console.log(inspectionsByMonkey.sort((a, b) => b - a).slice(0, 2));
  const topTwoMostActiveMonkeys = inspectionsByMonkey.sort((a, b) => b - a);

  return topTwoMostActiveMonkeys[0] * topTwoMostActiveMonkeys[1];
};

const testInput = `
  Monkey 0:
    Starting items: 79, 98
    Operation: new = old * 19
    Test: divisible by 23
      If true: throw to monkey 2
      If false: throw to monkey 3

  Monkey 1:
    Starting items: 54, 65, 75, 74
    Operation: new = old + 6
    Test: divisible by 19
      If true: throw to monkey 2
      If false: throw to monkey 0

  Monkey 2:
    Starting items: 79, 60, 97
    Operation: new = old * old
    Test: divisible by 13
      If true: throw to monkey 1
      If false: throw to monkey 3

  Monkey 3:
    Starting items: 74
    Operation: new = old + 3
    Test: divisible by 17
      If true: throw to monkey 0
      If false: throw to monkey 1
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 2713310158,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
