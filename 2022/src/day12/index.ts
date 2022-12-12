import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n').map((row) => row.split(''));

type Point = {
  i: number;
  j: number;
};

type GridPoint = Point & {
  value: string;
  charCode: number;
  f: number;
  g: number;
  h: number;
  neighbors: GridPoint[];
  parent: GridPoint | undefined;
};

// taxicab (or manhattan) distance
const heuristic = (p0: Point, p1: Point) => {
  let d1 = Math.abs(p1.i - p0.i);
  let d2 = Math.abs(p1.j - p0.j);

  return d1 + d2;
};

const getNeighbors = (grid: GridPoint[][], p: GridPoint) => {
  let neighbors: GridPoint[] = [];
  if (p.i > 0) neighbors.push(grid[p.i - 1][p.j]);
  if (p.i < grid.length - 1) neighbors.push(grid[p.i + 1][p.j]);
  if (p.j > 0) neighbors.push(grid[p.i][p.j - 1]);
  if (p.j < grid[0].length - 1) neighbors.push(grid[p.i][p.j + 1]);

  return neighbors.filter(
    (n) =>
      (p.value === 'S' && n.value === 'a') || // Start
      (p.value === 'z' && n.value === 'E') || // End
      (n.charCode >= 97 && n.charCode - p.charCode <= 1), // Valid move
  );
};

const buildGrid = (input: string[][]) => {
  let grid: GridPoint[][] = [[]];

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[0].length; j++) {
      if (!grid[i]) grid[i] = [];
      grid[i][j] = {
        value: input[i][j],
        charCode: input[i][j].charCodeAt(0),
        i,
        j,
        f: 0,
        g: 0,
        h: 0,
        neighbors: [],
        parent: undefined,
      };
    }
  }

  return grid;
};

const search = (grid: GridPoint[][], start: GridPoint, end: GridPoint) => {
  let openSet: GridPoint[] = []; //array containing unevaluated grid points
  let closedSet: GridPoint[] = []; //array containing completely evaluated grid points
  let path: GridPoint[] = [];
  openSet.push(start!);

  while (openSet.length > 0) {
    //assumption lowest index is the first one to begin with
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }
    let current = openSet[lowestIndex];

    if (current === end) {
      let temp = current;
      path.push(temp);
      while (temp.parent) {
        path.push(temp.parent);
        temp = temp.parent;
      }
      console.log('DONE!');
      // return the traced path
      return path.reverse();
    }

    //remove current from openSet
    openSet.splice(lowestIndex, 1);
    //add current to closedSet
    closedSet.push(current);

    let neighbors = current.neighbors;

    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];

      if (!closedSet.includes(neighbor)) {
        let possibleG = current.g + 1;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (possibleG >= neighbor.g) {
          continue;
        }

        neighbor.g = possibleG;
        neighbor.h = heuristic(neighbor, end);
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = current;
      }
    }
  }

  //no solution by default
  return [];
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let start: GridPoint;
  let end: GridPoint;

  const grid = buildGrid(input);

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j].neighbors = getNeighbors(grid, grid[i][j]);

      if (grid[i][j].value === 'S') start = grid[i][j];
      if (grid[i][j].value === 'E') end = grid[i][j];
    }
  }

  let path = search(grid, start!, end!);

  console.log(path.map((p) => p.value).join(''));

  return path.length - 1;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let end: GridPoint;
  let aLevelPositions: GridPoint[] = [];

  let grid = buildGrid(input);
  const cleanUpGrid = () => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        grid[i][j].f = 0;
        grid[i][j].g = 0;
        grid[i][j].h = 0;
        grid[i][j].parent = undefined;
      }
    }
  };

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      grid[i][j].neighbors = getNeighbors(grid, grid[i][j]);

      if (grid[i][j].value === 'E') end = grid[i][j];
      if (grid[i][j].value === 'a') aLevelPositions.push(grid[i][j]);
    }
  }

  let shortestPath = 99999999;
  for (let pos of aLevelPositions) {
    const path = search(grid, pos, end!);
    console.log(path.map((p) => p.value).join(''));
    if (path.length - 1 < shortestPath && path.length > 0) shortestPath = path.length - 1;
    cleanUpGrid();
  }

  return shortestPath;
};

const testInput = `
  Sabqponm
  abcryxxl
  accszExk
  acctuvwj
  abdefghi
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 29,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
