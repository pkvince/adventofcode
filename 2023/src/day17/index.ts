import run from 'aocrunner';
import {Heap} from 'heap-js';
import chalk from 'chalk';

const parseInput = (rawInput: string): number[][] =>
  rawInput.split('\n').map((line) => line.split('').map(Number));

enum Direction {
  Up = '^',
  Right = '>',
  Down = 'v',
  Left = '<',
}
type Heuristic = number;
type Block = [number, number, Direction];
type AccHeatLoss = number;
type NStepsInDirection = number;
type PrevStep = Step | null;

type Step = [Heuristic, Block, AccHeatLoss, NStepsInDirection, PrevStep];

const getNextPossibleBlocks: Record<Direction, (x: number, y: number) => Block[]> = {
  [Direction.Up]: (x, y) => [
    [x, y - 1, Direction.Up],
    [x + 1, y, Direction.Right],
    [x - 1, y, Direction.Left],
  ],
  [Direction.Right]: (x, y) => [
    [x, y + 1, Direction.Down],
    [x, y - 1, Direction.Up],
    [x + 1, y, Direction.Right],
  ],
  [Direction.Down]: (x, y) => [
    [x, y + 1, Direction.Down],
    [x + 1, y, Direction.Right],
    [x - 1, y, Direction.Left],
  ],
  [Direction.Left]: (x, y) => [
    [x, y + 1, Direction.Down],
    [x, y - 1, Direction.Up],
    [x - 1, y, Direction.Left],
  ],
};

const cacheKey = ([, [x, y, dir], , nSteps]: Step): string => `${x},${y},${dir},${nSteps}`;

const printPathOnGrid = (lastStep: Step, grid: (number | string)[][]) => {
  let temp = lastStep;
  let path: Step[] = [];
  while (temp) {
    path.push(temp);
    temp = temp[4]!;
  }
  for (const [, [x, y, d]] of path) {
    if (x === 0 && y === 0) continue;

    grid[y][x] = chalk.red.bold(d);
  }
  console.log(grid.map((row) => row.join('')).join('\n'));
};

const part1 = (input: string) => {
  const city = parseInput(input);

  const startX = 0;
  const startY = 0;
  const endX = city[0].length - 1;
  const endY = city.length - 1;

  // This will always be sorted by the heuristic, which is a combination of manhattan distance to end and accHeatLoss
  const openPriorityQueue = new Heap<Step>(([hA], [hB]) => hA - hB);
  openPriorityQueue.push([0, [startX, startY, Direction.Right], 0, 0, null]);
  openPriorityQueue.push([0, [startX, startY, Direction.Down], 0, 0, null]);

  const closedSet = new Set<string>();

  while (openPriorityQueue.size() >= 0) {
    const current = openPriorityQueue.pop()!;
    const [, [x, y, direction], accHeatLoss, nStepsInDirection] = current;
    if (x === endX && y === endY && nStepsInDirection) {
      console.log('Done!');

      printPathOnGrid(current, city);

      return accHeatLoss;
    }

    const nextPossibleBlocks = getNextPossibleBlocks[direction](x, y)
      .filter(([, , newDirection]) => (nStepsInDirection > 2 ? newDirection !== direction : true))
      .filter(([x, y]) => !(x < 0 || y < 0 || y > endY || x > endX));

    for (const nextBlock of nextPossibleBlocks) {
      const [nextX, nextY, nextDirection] = nextBlock;
      const nextAccHeatLoss = accHeatLoss + city[nextY][nextX];
      const nextNSteps = nextDirection === direction ? nStepsInDirection + 1 : 1;
      const distanceToEnd = endX - nextX + endY - nextY; // Manhattan distance to end
      const nextHeuristic = nextAccHeatLoss + distanceToEnd;

      let nextStep: Step = [nextHeuristic, nextBlock, nextAccHeatLoss, nextNSteps, current];

      const key = cacheKey(nextStep);
      if (!closedSet.has(key)) {
        closedSet.add(key);
        openPriorityQueue.push(nextStep);
      }
    }
  }

  return -999999;
};

const part2 = (input: string) => {
  const city = parseInput(input);

  const startX = 0;
  const startY = 0;
  const endX = city[0].length - 1;
  const endY = city.length - 1;

  const openPriorityQueue = new Heap<Step>(([hA], [hB]) => hA - hB);
  openPriorityQueue.push([0, [startX, startY, Direction.Right], 0, 0, null]);
  openPriorityQueue.push([0, [startX, startY, Direction.Down], 0, 0, null]);

  const closedSet = new Set<string>();

  while (openPriorityQueue.size() >= 0) {
    const current = openPriorityQueue.pop()!;
    const [, [x, y, direction], heatLoss, nSteps] = current;
    if (x === endX && y === endY) {
      if (nSteps < 4) continue;

      console.log('Done!');

      printPathOnGrid(current, city);

      return heatLoss;
    }

    const nextPossibleBlocks = getNextPossibleBlocks[direction](x, y)
      .filter(([, , newDirection]) => (nSteps < 4 ? newDirection === direction : true))
      .filter(([, , newDirection]) => (nSteps > 9 ? newDirection !== direction : true))
      .filter(([x, y]) => !(x < 0 || y < 0 || y > endY || x > endX));

    for (const [nextX, nextY, nextDirection] of nextPossibleBlocks) {
      let nextBlock: Step = [
        heatLoss + city[nextY][nextX] + endX - nextX + endY - nextY,
        [nextX, nextY, nextDirection],
        heatLoss + city[nextY][nextX],
        nextDirection === direction ? nSteps + 1 : 1,
        current,
      ];

      const key = cacheKey(nextBlock);
      if (!closedSet.has(key)) {
        closedSet.add(key);
        openPriorityQueue.push(nextBlock);
      }
    }
  }

  return -999999;
};

run({
  part1: {
    tests: [
      {
        input: `
          2413432311323
          3215453535623
          3255245654254
          3446585845452
          4546657867536
          1438598798454
          4457876987766
          3637877979653
          4654967986887
          4564679986453
          1224686865563
          2546548887735
          4322674655533
        `,
        expected: 102,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          2413432311323
          3215453535623
          3255245654254
          3446585845452
          4546657867536
          1438598798454
          4457876987766
          3637877979653
          4654967986887
          4564679986453
          1224686865563
          2546548887735
          4322674655533
        `,
        expected: 94,
      },
      {
        input: `
          111111111111
          999999999991
          999999999991
          999999999991
          999999999991
        `,
        expected: 71,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
