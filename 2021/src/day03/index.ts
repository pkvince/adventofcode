import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const sumOfOnes = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[0].length; j++) {
      if (!sumOfOnes[j]) sumOfOnes[j] = 0;
      if (input[i][j] === '1') sumOfOnes[j] += 1;
    }
  }

  const gammaRate = parseInt(
    sumOfOnes.map((sum) => (sum > input.length / 2 ? '1' : '0')).join(''),
    2,
  );

  const epsilonRate = parseInt(
    sumOfOnes.map((sum) => (sum > input.length / 2 ? '0' : '1')).join(''),
    2,
  );

  return gammaRate * epsilonRate;
};

const getOxygen = (numbers: string[]) => {
  let filteredNumbers = numbers;
  for (let bitCriteriaIndex = 0; bitCriteriaIndex < numbers[0].length; bitCriteriaIndex++) {
    let countOfOnes = 0;
    console.log({bitCriteriaIndex, filteredNumbers});
    for (let i = 0; i < filteredNumbers.length; i++) {
      if (filteredNumbers[i][bitCriteriaIndex] === '1') countOfOnes++;
    }
    const filterNumbersStartingWithOne = countOfOnes >= filteredNumbers.length / 2;
    filteredNumbers = filteredNumbers.filter((num) =>
      filterNumbersStartingWithOne ? num[bitCriteriaIndex] === '1' : num[bitCriteriaIndex] === '0',
    );
    console.log({countOfOnes, filterNumbersStartingWithOne, filteredNumbers});
    if (filteredNumbers.length === 1) break;
  }
  return parseInt(filteredNumbers[0], 2);
};

const getCo2 = (numbers: string[]) => {
  let filteredNumbers = numbers;
  for (let bitCriteriaIndex = 0; bitCriteriaIndex < numbers[0].length; bitCriteriaIndex++) {
    let countOfOnes = 0;
    console.log({bitCriteriaIndex, filteredNumbers});
    for (let i = 0; i < filteredNumbers.length; i++) {
      if (filteredNumbers[i][bitCriteriaIndex] === '1') countOfOnes++;
    }
    const filterNumbersStartingWithOne = countOfOnes < filteredNumbers.length / 2;
    filteredNumbers = filteredNumbers.filter((num) =>
      filterNumbersStartingWithOne ? num[bitCriteriaIndex] === '1' : num[bitCriteriaIndex] === '0',
    );
    console.log({countOfOnes, filterNumbersStartingWithOne, filteredNumbers});
    if (filteredNumbers.length === 1) break;
  }
  return parseInt(filteredNumbers[0], 2);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const oxygen = getOxygen(input);
  const co2 = getCo2(input);

  console.log({oxygen, co2});

  return oxygen * co2;
};

const testInput = `
  00100
  11110
  10110
  10111
  10101
  01111
  00111
  11100
  10000
  11001
  00010
  01010
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 198,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 230,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
