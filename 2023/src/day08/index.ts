import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.replace(/\(|\)/g, '').split('\n\n');

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const [instructions, mapRows] = input;

  const map: Record<string, [string, string]> = {};
  for (const rows of mapRows.split('\n')) {
    const [parent, children] = rows.split(' = ');
    const childNodes = children.split(', ');
    map[parent] = childNodes as [string, string];
  }

  let nSteps = 0;
  let next = 'AAA';
  while (next !== 'ZZZ') {
    let nextMove = instructions[nSteps % instructions.length];
    nSteps += 1;
    const [left, right] = map[next];
    next = nextMove === 'L' ? left : right;
  }

  return nSteps;
};

const lcm = (...arr: number[]): number => {
  const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
  const lcm = (x: number, y: number): number => (x * y) / gcd(x, y);
  return [...arr].reduce(lcm);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const [instructions, mapRows] = input;

  const map: Record<string, [string, string]> = {};
  for (const rows of mapRows.split('\n')) {
    const [parent, children] = rows.split(' = ');
    const childNodes = children.split(', ');
    map[parent] = childNodes as [string, string];
  }

  const camels = Object.keys(map)
    .filter((key) => /A$/.test(key))
    .map((key) => ({next: key, factor: -1}));

  let nSteps = 0;
  while (camels.some(({next}) => /Z$/.test(next) === false)) {
    let nextMove = instructions[nSteps % instructions.length];
    nSteps += 1;
    for (const camel of camels) {
      if (camel.factor !== -1) continue;

      const [left, right] = map[camel.next];
      camel.next = nextMove === 'L' ? left : right;
      if (/Z$/.test(camel.next)) {
        camel.factor = nSteps;
      }
    }
  }

  return lcm(...(camels.map(({factor}) => factor) as any));
};

run({
  part1: {
    tests: [
      {
        input: `
          RL

          AAA = (BBB, CCC)
          BBB = (DDD, EEE)
          CCC = (ZZZ, GGG)
          DDD = (DDD, DDD)
          EEE = (EEE, EEE)
          GGG = (GGG, GGG)
          ZZZ = (ZZZ, ZZZ)
        `,
        expected: 2,
      },
      {
        input: `
          LLR

          AAA = (BBB, BBB)
          BBB = (AAA, ZZZ)
          ZZZ = (ZZZ, ZZZ)
        `,
        expected: 6,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          LR

          11A = (11B, XXX)
          11B = (XXX, 11Z)
          11Z = (11B, XXX)
          22A = (22B, XXX)
          22B = (22C, 22C)
          22C = (22Z, 22Z)
          22Z = (22B, 22B)
          XXX = (XXX, XXX)
        `,
        expected: 6,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
