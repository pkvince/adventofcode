import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

const snafuToDecimal = (num: string): number => {
  return [...num].reverse().reduce<number>((acc, digit, index) => {
    let pow: number = 5 ** index;

    switch (digit) {
      case '=':
        return acc + -2 * pow;
      case '-':
        return acc - pow;
      default:
        return acc + parseInt(digit) * pow;
    }
  }, 0);
};

const decimalToSnafuBak = (num: number): string => {
  console.log(num);
  let stringResult = '';
  let pos = 0 - 1;
  let result = num;
  let remainder;

  while (result / 5 > 0) {
    remainder = result % 5;
    result = (result - remainder) / 5;
    console.log({result, remainder});

    if (remainder === 4) {
      stringResult = '=' + stringResult;
      console.log('adding', 5 ** pos, 'to result ->', result + 5 ** pos);
      // result = result + 5 ** pos;
    } else if (remainder === 3) {
      stringResult = '-' + stringResult;
      console.log('adding', 5 ** pos, 'to result ->', result + 5 ** pos);
      // result = result + 5 ** pos;
    } else {
      stringResult = remainder + stringResult;
    }

    console.log({stringResult});
    console.log('');
    pos++;
  }

  return stringResult;
};

const decimalToSnafu = (num: number): string => {
  const snafu = [...num.toString(5)];

  for (let i = snafu.length - 1; i > 0; i--) {
    if (snafu[i] === '3') {
      snafu[i] = '=';
      snafu[i - 1] = (parseInt(snafu[i - 1]) + 1).toString();
    } else if (snafu[i] === '4') {
      snafu[i] = '-';
      snafu[i - 1] = (parseInt(snafu[i - 1]) + 1).toString();
    }
  }
  // if (snafu[0] === '0') snafu.shift();
  return snafu.join('');
};

const part1 = (rawInput: string) => {
  const snafuNumbers = parseInput(rawInput);

  let sum = 0;
  for (let num of snafuNumbers) {
    sum += snafuToDecimal(num);
  }

  console.log(sum);

  console.log(decimalToSnafu(sum));

  return decimalToSnafu(sum);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

const testInput = `
  1=-0-2
  12111
  2=0=
  21
  2=01
  111
  20012
  112
  1=-1=
  1-12
  12
  1=
  122
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: '2=-1=0',
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
