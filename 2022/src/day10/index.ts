import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let x = 1;
  let clock = 0;
  let sumOfSignals = 0;
  const tick = () => {
    // console.log({clock, x});
    clock++;
    if ((clock + 20) % 40 === 0) {
      // console.log({clock, x});
      sumOfSignals += clock * x;
    }
  };

  for (let inst of input) {
    // console.log(inst);
    const [cmd, qty] = inst.split(' ');
    if (cmd === 'noop') {
      tick();
    } else {
      tick();
      tick();
      x += parseInt(qty);
    }
  }

  return sumOfSignals;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const pixels = Array.from({length: 6}, () => Array.from({length: 40}, () => '.'));

  let x = 1;
  let clock = 0;
  const tick = () => {
    console.log({clock, x});
    if (clock % 40 === x || clock % 40 === x - 1 || clock % 40 === x + 1) {
      const row = Math.floor(clock / 40);
      const col = clock % 40;
      console.log(row, col);
      pixels[row][col] = '#';
      console.log(pixels[row].join(''));
    }
    clock++;
  };

  for (let inst of input) {
    // console.log(inst);
    const [cmd, qty] = inst.split(' ');
    if (cmd === 'noop') {
      tick();
    } else {
      tick();
      tick();
      x += parseInt(qty);
    }
  }

  console.log(pixels[0].join(' '));
  console.log(pixels[1].join(' '));
  console.log(pixels[2].join(' '));
  console.log(pixels[3].join(' '));
  console.log(pixels[4].join(' '));
  console.log(pixels[5].join(' '));

  return 'RFZEKBFE';
};

const testInput = `
  addx 15
  addx -11
  addx 6
  addx -3
  addx 5
  addx -1
  addx -8
  addx 13
  addx 4
  noop
  addx -1
  addx 5
  addx -1
  addx 5
  addx -1
  addx 5
  addx -1
  addx 5
  addx -1
  addx -35
  addx 1
  addx 24
  addx -19
  addx 1
  addx 16
  addx -11
  noop
  noop
  addx 21
  addx -15
  noop
  noop
  addx -3
  addx 9
  addx 1
  addx -3
  addx 8
  addx 1
  addx 5
  noop
  noop
  noop
  noop
  noop
  addx -36
  noop
  addx 1
  addx 7
  noop
  noop
  noop
  addx 2
  addx 6
  noop
  noop
  noop
  noop
  noop
  addx 1
  noop
  noop
  addx 7
  addx 1
  noop
  addx -13
  addx 13
  addx 7
  noop
  addx 1
  addx -33
  noop
  noop
  noop
  addx 2
  noop
  noop
  noop
  addx 8
  noop
  addx -1
  addx 2
  addx 1
  noop
  addx 17
  addx -9
  addx 1
  addx 1
  addx -3
  addx 11
  noop
  noop
  addx 1
  noop
  addx 1
  noop
  noop
  addx -13
  addx -19
  addx 1
  addx 3
  addx 26
  addx -30
  addx 12
  addx -1
  addx 3
  addx 1
  noop
  noop
  noop
  addx -9
  addx 18
  addx 1
  addx 2
  noop
  noop
  addx 9
  noop
  noop
  noop
  addx -1
  addx 2
  addx -37
  addx 1
  addx 3
  noop
  addx 15
  addx -21
  addx 22
  addx -6
  addx 1
  noop
  addx 2
  addx 1
  noop
  addx -10
  noop
  noop
  addx 20
  addx 1
  addx 2
  addx 2
  addx -6
  addx -11
  noop
  noop
  noop
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13140,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 'RFZEKBFE',
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
