import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n').map((row) => row.split(''));

const transpose = (arr: string[][]) => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      const tmp = arr[i][j];
      arr[i][j] = arr[j][i];
      arr[j][i] = tmp;
    }
  }
};

enum Direction {
  Up,
  Down,
  Left,
  Right,
}

const tiltPlatorm = (platform: string[][], direction: Direction) => {
  if (direction === Direction.Up || direction === Direction.Down) {
    transpose(platform);
    tiltPlatorm(platform, direction === Direction.Up ? Direction.Left : Direction.Right);
    transpose(platform);
    return;
  }

  for (let i = 0; i < platform.length; i++) {
    const sections = platform[i].join('').split('#');
    const sortedSections = sections.map((section) =>
      section
        .split('')
        .sort((a, b) => {
          if (a === 'O') {
            return direction === Direction.Left ? -1 : 1;
          } else {
            return direction === Direction.Left ? 1 : -1;
          }
        })
        .join(''),
    );
    platform[i] = sortedSections.join('#').split('');
  }
};

const getLoadOnNorthBeams = (platform: string[][]) => {
  transpose(platform);
  let sum = 0;
  for (const col of platform) {
    sum += col.reduce((acc, v, i, arr) => acc + (v === 'O' ? arr.length - i : 0), 0);
  }
  transpose(platform);
  return sum;
};

function findRepeatingSequence(arr: number[]): {sequence: number[]; length: number} | null {
  const maxLength = Math.floor(arr.length / 2);

  // Arbitrary start length of 4
  for (let length = 4; length <= maxLength; length++) {
    const potentialSequence = arr.slice(-length);
    const potentialPreviousSequence = arr.slice(-length * 2, -length);
    const isRepeating = potentialSequence.every(
      (value, index) => value === potentialPreviousSequence[index],
    );

    if (isRepeating) {
      return {sequence: potentialSequence, length};
    }
  }

  return null; // No repeating sequence found
}

const printPlatform = (platform: string[][]) => {
  for (const row of platform) {
    console.log(row.join(''));
  }
  console.log('\n');
};

const part1 = (rawInput: string) => {
  const platform = parseInput(rawInput);

  tiltPlatorm(platform, Direction.Up);
  printPlatform(platform);

  return getLoadOnNorthBeams(platform);
};

const part2 = (rawInput: string) => {
  const platform = parseInput(rawInput);
  printPlatform(platform);

  const loadsOverTime = [];
  const cycles = 1000000000;
  for (let i = 1; i <= cycles; i++) {
    // Tilt north
    tiltPlatorm(platform, Direction.Up);

    // Tilt west
    tiltPlatorm(platform, Direction.Left);

    // Tilt south
    tiltPlatorm(platform, Direction.Down);

    // Tilt east
    tiltPlatorm(platform, Direction.Right);

    const currentLoad = getLoadOnNorthBeams(platform);
    loadsOverTime.push(currentLoad);
    const sequence = findRepeatingSequence(loadsOverTime);
    if (sequence) {
      // console.log('Found repeating sequence!', sequence.sequence, sequence.length);
      const cycle = 1000000000;
      const cycleIndex = (cycle - i - 1) % sequence.length;
      const value = sequence.sequence[cycleIndex];
      return value;
    }
  }

  return getLoadOnNorthBeams(platform);
};

run({
  part1: {
    tests: [
      {
        input: `
          O....#....
          O.OO#....#
          .....##...
          OO.#O....O
          .O.....O#.
          O.#..O.#.#
          ..O..#O..O
          .......O..
          #....###..
          #OO..#....
        `,
        expected: 136,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          O....#....
          O.OO#....#
          .....##...
          OO.#O....O
          .O.....O#.
          O.#..O.#.#
          ..O..#O..O
          .......O..
          #....###..
          #OO..#....
        `,
        expected: 64,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
