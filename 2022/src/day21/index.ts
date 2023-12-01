import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n').map((row) => row.split(': '));

const Operations = {
  '+': (x: number, y: number) => x + y,
  '-': (x: number, y: number) => x - y,
  '*': (x: number, y: number) => x * y,
  '/': (x: number, y: number) => x / y,
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const monkeys: Record<string, number> = {};
  while (input.length > 0) {
    let nextOpIndex = input.findIndex(([monkey, op]) => {
      // console.log('checking', {monkey, op});
      if (monkey === 'root' && input.length > 1) return false;
      if (parseInt(op) >= 0) return true;
      const [a, b] = op.match(/([a-z]{4})/g)!;
      return monkeys[a] && monkeys[b];
    });

    const [monkey, op] = input.splice(nextOpIndex, 1)[0];

    if (parseInt(op) >= 0) {
      monkeys[monkey] = parseInt(op);
    } else {
      const opTokens = op.split(' ');
      monkeys[monkey] = Operations[opTokens[1]](monkeys[opTokens[0]], monkeys[opTokens[2]]);
    }
  }

  return monkeys['root'];
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const testInput = `
  root: pppw + sjmn
  dbpl: 5
  cczh: sllz + lgvd
  zczc: 2
  ptdq: humn - dvpt
  dvpt: 3
  lfqf: 4
  humn: 5
  ljgn: 2
  sjmn: drzm * dbpl
  sllz: 4
  pppw: cczh / lfqf
  lgvd: ljgn * ptdq
  drzm: hmdt - zczc
  hmdt: 32
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 152,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
