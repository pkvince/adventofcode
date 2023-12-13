import run from 'aocrunner';
import nj from 'numjs';

(nj as any).config.printThreshold = 20;

const arrDistance = (a: number[], b: number[]) => {
  return a.reduce((acc, v, i) => (v === b[i] ? acc : acc + 1), 0);
};

const parseInput = (rawInput: string) =>
  rawInput
    .split('\n\n')
    .map((pattern) =>
      nj.array(pattern.split('\n').map((row) => row.split('').map((c) => (c === '#' ? 1 : 0)))),
    );

const findReflectionPointIndex = (matrix: nj.NdArray<(0 | 1)[]>, withSmudge = false) => {
  for (let i = 0; i < matrix.shape[0] - 1; i++) {
    const maxRows = Math.min(i + 1, matrix.shape[0] - i - 1);

    const up = matrix
      .slice([i + 1])
      .slice(-maxRows)
      .slice([null, null, -1]);
    const down = matrix.slice(i + 1).slice([maxRows]);

    if (withSmudge) {
      const upArr = up.tolist().flat();
      const downArr = down.tolist().flat();
      const distance = arrDistance(upArr, downArr);
      if (distance === 1) {
        return i + 1;
      }
    } else {
      if (up.equal(down)) {
        return i + 1;
      }
    }
  }

  return 0;
};

const part1 = (rawInput: string) => {
  const patterns = parseInput(rawInput);

  let sum = 0;

  for (const pattern of patterns) {
    const horizontalReflectionPointIndex = findReflectionPointIndex(pattern);
    const verticalReflectionPointIndex = findReflectionPointIndex(pattern.T);

    sum += 100 * horizontalReflectionPointIndex + verticalReflectionPointIndex;
  }

  return sum;
};

const part2 = (rawInput: string) => {
  const patterns = parseInput(rawInput);

  let sum = 0;

  for (const pattern of patterns) {
    const horizontalReflectionPointIndex = findReflectionPointIndex(pattern, true);
    const verticalReflectionPointIndex = findReflectionPointIndex(pattern.T, true);

    sum += 100 * horizontalReflectionPointIndex + verticalReflectionPointIndex;
  }

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `
          #.##..##.
          ..#.##.#.
          ##......#
          ##......#
          ..#.##.#.
          ..##..##.
          #.#.##.#.
          
          #...##..#
          #....#..#
          ..##..###
          #####.##.
          #####.##.
          ..##..###
          #....#..#
        `,
        expected: 405,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          #.##..##.
          ..#.##.#.
          ##......#
          ##......#
          ..#.##.#.
          ..##..##.
          #.#.##.#.

          #...##..#
          #....#..#
          ..##..###
          #####.##.
          #####.##.
          ..##..###
          #....#..#
        `,
        expected: 400,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
