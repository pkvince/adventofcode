import run from 'aocrunner';

const parseInput = (rawInput: string) =>
  rawInput.split('\n').map((row) => row.split('').map((val) => parseInt(val)));

const areAllLowerThan = (trees: number[], height: number) => {
  return trees.every((tree) => tree < height);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const size = input.length;

  let visibleTreesCount = 0;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (i === 0 || j === 0 || i === size - 1 || j === size - 1) {
        visibleTreesCount++;
        continue;
      }

      const left = input[i].slice(0, j);
      const right = input[i].slice(j + 1);
      const top = Array.from({length: i}, (v, k) => input[k][j]);
      const bottom = Array.from({length: size - (i + 1)}, (v, k) => input[i + 1 + k][j]);

      const height = input[i][j];

      if (
        areAllLowerThan(left, height) ||
        areAllLowerThan(right, height) ||
        areAllLowerThan(top, height) ||
        areAllLowerThan(bottom, height)
      ) {
        visibleTreesCount++;
      }
    }
  }

  return visibleTreesCount;
};

const checkViewDistance = (trees: number[], height: number) => {
  if (trees.length === 1) return 1;
  const nextBlockingTreeIndex = trees.findIndex((tree) => tree >= height);
  return nextBlockingTreeIndex === -1 ? trees.length : nextBlockingTreeIndex + 1;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const size = input.length;

  let highestScenicScore = 0;
  for (let i = 1; i < size - 1; i++) {
    for (let j = 1; j < size - 1; j++) {
      const left = input[i].slice(0, j).reverse();
      const right = input[i].slice(j + 1);
      const top = Array.from({length: i}, (v, k) => input[k][j]).reverse();
      const bottom = Array.from({length: size - (i + 1)}, (v, k) => input[i + 1 + k][j]);

      const height = input[i][j];

      const topScore = checkViewDistance(top, height);
      const rightScore = checkViewDistance(right, height);
      const bottomScore = checkViewDistance(bottom, height);
      const leftScore = checkViewDistance(left, height);

      const viewScore = topScore * rightScore * bottomScore * leftScore;

      if (viewScore > highestScenicScore) highestScenicScore = viewScore;
    }
  }

  return highestScenicScore;
};

const testInput = `
  30373
  25512
  65332
  33549
  35390
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
