import run from 'aocrunner';

type Path = [number, number][];
type Map = (string | null)[][];

const parseInput = (rawInput: string) =>
  rawInput
    .split('\n')
    .map(
      (row) => row.split(' -> ').map((pair) => pair.split(',').map((num) => parseInt(num))) as Path,
    );

const buildCaveMap = (paths: Path[], withFloor = false): Map => {
  let startX = 500;
  let endX = 500;
  let endY = 0;
  for (let path of paths) {
    for (let pair of path) {
      if (startX > pair[0]) startX = pair[0];
      if (endX < pair[0]) endX = pair[0];
      if (endY < pair[1]) endY = pair[1];
    }
  }
  if (withFloor) {
    startX = 330;
    endX = 680;
  }
  let map: Map = Array.from({length: endY + 2}, () =>
    Array.from({length: endX + 2}, (_, i) => (i >= startX - 1 ? '.' : null)),
  );

  for (let path of paths) {
    for (let i = 1; i < path.length; i++) {
      let x1 = path[i - 1][0];
      let y1 = path[i - 1][1];
      let x2 = path[i][0];
      let y2 = path[i][1];

      let deltaX = x2 - x1;
      let deltaY = y2 - y1;

      if (!map[y1]) map[y1] = [];
      map[y1][x1] = '#';

      while (Math.abs(deltaX) > 0) {
        x1 = x1 + deltaX / Math.abs(deltaX);
        deltaX = x2 - x1;
        if (!map[y1]) map[y1] = [];
        map[y1][x1] = '#';
      }

      while (Math.abs(deltaY) > 0) {
        y1 = y1 + deltaY / Math.abs(deltaY);
        deltaY = y2 - y1;
        if (!map[y1]) map[y1] = [];
        map[y1][x1] = '#';
      }
    }
  }

  map[0][500] = '+';

  if (withFloor) {
    map.push(Array.from({length: endX + 2}, () => '#'));
    map.push(Array.from({length: endX + 2}, () => '.'));
  }

  return map;
};

const printMap = (map: Map) => {
  const startX = map[0].findIndex((point) => point === '.');

  for (let row of map) {
    for (let point of row ?? []) {
      if (!point) point = '.';
    }
    console.log(
      (row ?? [])
        .slice(startX)
        .map((point) => point ?? '.')
        .join(''),
    );
  }
};

const letSandFallFrom = (map: Map, pos: [number, number]): [number, number] | 'abyss' => {
  let x = pos[0];
  let y = pos[1];

  if (y >= map.length - 1) return 'abyss';

  // console.log('grain falling', pos, 'below is', map[y + 1][x]);

  if (map[y + 1][x] !== '.') {
    // Fell on something
    // console.log('fell on something');
    if (map[y + 1][x - 1] === '.') {
      // Can fall diagonally to the left
      // console.log('diagonal left', `${x - 1},${y + 1}`, map[y + 1][x - 1]);
      return letSandFallFrom(map, [x - 1, y + 1]);
    }

    if (map[y + 1][x + 1] === '.') {
      // Can fall diagonally to the right
      return letSandFallFrom(map, [x + 1, y + 1]);
    }

    // console.log('settled');
    return [x, y];
  }

  // Continue falling
  return letSandFallFrom(map, [x, y + 1]);
};

const part1 = (rawInput: string) => {
  const paths = parseInput(rawInput);

  let map = buildCaveMap(paths);

  let i = 0;
  while (true) {
    const fallenSand = letSandFallFrom(map, [500, 0]);
    console.log(`Grain ${i + 1} fell to ${fallenSand}`);
    if (fallenSand !== 'abyss') {
      map[fallenSand[1]][fallenSand[0]] = 'o';
      i++;
      // console.log('');

      // printMap(map);
      continue;
    }
    // console.log('');
    break;
  }

  printMap(map);

  return i;
};

const part2 = (rawInput: string) => {
  const paths = parseInput(rawInput);

  let map = buildCaveMap(paths, true);

  let i = 0;
  while (true) {
    const fallenSand = letSandFallFrom(map, [500, 0]);
    console.log(`Grain ${i + 1} fell to ${fallenSand}`);
    if (fallenSand !== 'abyss') {
      map[fallenSand[1]][fallenSand[0]] = 'o';
      i++;

      if (fallenSand[1] === 0) {
        console.log('FULLLLLLL');
        break;
      }

      continue;
    }

    break;
  }

  printMap(map);

  return i;
};

const testInput = `
  498,4 -> 498,6 -> 496,6
  503,4 -> 502,4 -> 502,9 -> 494,9
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 24,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 93,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
