import run from 'aocrunner';

const parseInput = (rawInput: string): string[] => rawInput.split('\n');

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let sum = 0;
  for (const row of input) {
    const digits: string[] = [];
    for (let i = 0; i < row.length; i++) {
      if (/\d/.test(row[i])) {
        digits.push(row[i]);
        break;
      }
    }
    for (let j = row.length - 1; j >= 0; j--) {
      if (/\d/.test(row[j])) {
        digits.push(row[j]);
        break;
      }
    }
    sum += parseInt(digits.join(''));
  }

  return sum;
};

const digitsMap: Record<string, string> = {
  zero: '0',
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
};
const digitRegex = /^(\d|zero|one|two|three|four|five|six|seven|eight|nine)/;

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let sum = 0;
  for (const row of input) {
    const digits: string[] = [];
    for (let i = 0; i < row.length; i++) {
      const match = row.slice(i).match(digitRegex);

      if (match) {
        digits.push(digitsMap[match[0]] ?? match[0]);
        break;
      }
    }
    for (let j = row.length - 1; j >= 0; j--) {
      const match = row.slice(j).match(digitRegex);

      if (match) {
        digits.push(digitsMap[match[0]] ?? match[0]);
        break;
      }
    }
    sum += parseInt(digits.join(''));
  }

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `
          1abc2
          pqr3stu8vwx
          a1b2c3d4e5f
          treb7uchet
        `,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          two1nine
          eightwothree
          abcone2threexyz
          xtwone3four
          4nineeightseven2
          zoneight234
          7pqrstsixteen
        `,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
