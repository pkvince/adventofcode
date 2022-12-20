import run from 'aocrunner';
import _ from 'lodash';

type Pos = [number, number, number];

const parseInput = (rawInput: string) =>
  rawInput.split('\n').map((row) => row.split(',').map((num) => parseInt(num)) as Pos);

const getNeighbors = ([x, y, z]: Pos): [Pos, Pos, Pos, Pos, Pos, Pos] => [
  [x + 1, y, z],
  [x, y + 1, z],
  [x, y, z + 1],
  [x - 1, y, z],
  [x, y - 1, z],
  [x, y, z - 1],
];

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const freeSides = (pos: Pos): number => {
    let freeSides = 6;

    const neighbors = getNeighbors(pos);

    for (let row of input) {
      if (_.isEqual(pos, row)) continue;

      for (let neighbor of neighbors) {
        if (_.isEqual(row, neighbor)) {
          freeSides--;
        }
      }
    }

    return freeSides;
  };

  let freeSidesTotal = 0;
  for (let row of input) {
    freeSidesTotal += freeSides(row);
  }

  return freeSidesTotal;
};

const text = ([x, y, z]: Pos) => `${x},${y},${z}`;

const part2 = (rawInput: string) => {
  const filled = parseInput(rawInput);

  const size = filled.reduce((acc, pos) => Math.max(acc, ...pos), 0);
  const isExterior = ([x, y, z]: Pos) =>
    x <= 0 || y <= 0 || z <= 0 || x >= size || y >= size || z >= size;

  const cubesSet = new Set(filled.map((pos) => text(pos)));
  const hasAccessToOutside = (pos: Pos, visited: Set<string>): boolean => {
    if (cubesSet.has(text(pos))) {
      // console.log(pos, 'is filled');
      return false;
    }

    if (isExterior(pos)) {
      // console.log(pos, 'is outside!!!!');
      return true;
    }

    visited.add(text(pos));
    // console.log(visited);
    const emptyNeighbors = getNeighbors(pos).filter((neighbor) => !cubesSet.has(text(neighbor)));

    let hasAccessThroughSomeNeighbor = false;
    for (let neighbor of emptyNeighbors) {
      if (isExterior(neighbor)) {
        // console.log(pos, 'is outside!!!!');
        return true;
      }

      if (!visited.has(text(neighbor))) {
        const hasAccess = hasAccessToOutside(neighbor, visited);
        hasAccessThroughSomeNeighbor = hasAccessThroughSomeNeighbor || hasAccess;
      }

      if (hasAccessThroughSomeNeighbor) break;
    }

    if (!hasAccessThroughSomeNeighbor) {
      // console.log('pocket of air', pos);
    }

    return hasAccessThroughSomeNeighbor;
  };

  let facesOnTheOutside = 0;
  for (let pos of filled) {
    const neighbors = getNeighbors(pos);
    // console.log('Checking row', pos, JSON.stringify(neighbors));
    for (let neighbor of neighbors) {
      if (hasAccessToOutside(neighbor, new Set<string>())) {
        facesOnTheOutside++;
      }
    }

    // console.log({facesOnTheOutside});
    // console.log('');
  }

  return facesOnTheOutside;
};

const testInput = `
  2,2,2
  1,2,2
  3,2,2
  2,1,2
  2,3,2
  2,2,1
  2,2,3
  2,2,4
  2,2,6
  1,2,5
  3,2,5
  2,1,5
  2,3,5
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 64,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 58,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
