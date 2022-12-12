import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n').map((row) => row.split(''));

type Pos = {
  i: number;
  j: number;
};

const equals = (p1: Pos, p2: Pos) => p1.i === p2.i && p1.j === p2.j;
const get = (grid: string[][], p: Pos) => grid[p.i][p.j];

const getNeighbors = (grid: string[][], p: Pos) => {
  let neighbors: Pos[] = [];
  if (p.i > 0) neighbors.push({...p, i: p.i - 1}); // UP
  if (p.i < grid.length - 1) neighbors.push({...p, i: p.i + 1}); // DOWN
  if (p.j > 0) neighbors.push({...p, j: p.j - 1}); // LEFT
  if (p.j < grid[0].length - 1) neighbors.push({...p, j: p.j + 1}); // RIGHT

  return neighbors;
};

let shortestPathFound = 999999999999;
const shortestPath = (
  grid: string[][],
  p: Pos,
  dst: Pos,
  visitedPos: Set<string>,
): number | false => {
  console.log('');
  console.log('Checking shortest path for', get(grid, p), p);
  console.log('Current distance', visitedPos.size, visitedPos);
  // const isEnd = get(grid, p) === 'E';
  // if (isEnd) {
  //   console.log('End found', visitedPos.size - 2);
  //   // throw new Error('End found' + visitedPos.size);
  //   return visitedPos.size;
  // }

  const isStart = get(grid, p) === 'S';
  visitedPos.add(`${p.i},${p.j}`);

  const neighbors = getNeighbors(grid, p);
  console.log({neighbors});
  if (neighbors.some((n) => get(grid, n) === 'E')) {
    console.log('Neighbor is E!!!', visitedPos);
    if (shortestPathFound > visitedPos.size) shortestPathFound = visitedPos.size;
    return visitedPos.size;
  }

  const elligibleNeighbors = neighbors.filter((n) => {
    if (isStart) return get(grid, n) === 'a';

    const currCharVal = get(grid, p).charCodeAt(0);
    const neigCharVal = get(grid, n).charCodeAt(0);
    // const isVisited = !visitedPos.has(`${p.i},${p.j}`);
    // console.log('Checking neighbor', {
    //   n,
    //   currCharVal,
    //   neigCharVal,
    //   visitedPos,
    //   isVisited,
    //   calc: neigCharVal - currCharVal,
    // });
    return !visitedPos.has(`${n.i},${n.j}`) && neigCharVal - currCharVal <= 1;
  });
  console.log({elligibleNeighbors});

  if (elligibleNeighbors.length === 0) return false;

  let paths: number[] = [];
  while (elligibleNeighbors.length) {
    const n = elligibleNeighbors.pop()!;
    console.log('checking path for elligible neighbor', get(grid, n), n);
    const path = shortestPath(grid, n, dst, new Set(visitedPos));
    console.log('got path val of', path);
    if (path !== false) paths.push(path);
  }

  console.log({paths: paths.sort()});

  return visitedPos.size;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let startPos: Pos;
  let endPos: Pos;

  for (let i = 0; i < input.length; i++) {
    for (let j = 0; j < input[i].length; j++) {
      if (input[i][j] === 'S') startPos = {i, j};
      if (input[i][j] === 'E') endPos = {i, j};
    }
  }

  shortestPath(input, startPos!, endPos!, new Set<string>([]));

  return shortestPathFound;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
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
        input: `
          Sab
          qfE
        `,
        expected: 3,
      },
      // {
      //   input: testInput,
      //   expected: 31,
      // },
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
  onlyTests: true,
});
