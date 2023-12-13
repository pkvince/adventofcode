import run from 'aocrunner';

const parseInput = (rawInput: string) =>
  rawInput.split('\n').map((line) => {
    const [map, groups] = line.split(' ');

    return {
      map,
      groups: groups.split(',').map(Number),
      arrangements: [],
    };
  });

let cache: Record<string, number> = {};
let tableRows: any[] = [];

const countArrangements = (
  map: string,
  groups: number[],
  i: number, // Map iterator
  n: number, // Number of possible combos
  g: number = 0, // Group iterator
): number => {
  const cacheKey = `${i}-${n}-${g}`;

  tableRows.push({cacheKey: cacheKey, map: map.slice(i), group: groups.slice(n), g: g});
  // console.log({cacheKey: cacheKey, map: map.slice(i), group: groups.slice(n), g: g});

  // Do not recompute
  if (cache.hasOwnProperty(cacheKey)) {
    // console.log('Cache hit');
    return cache[cacheKey];
  }

  if (i >= map.length) {
    // console.log('We are at the end of the map');
    return n === groups.length ? 1 : 0;
  }

  if (map[i] === '.' || map[i] === '?') {
    // console.log('Test further arrangements');
    g += countArrangements(map, groups, i + 1, n);
  }

  if (n === groups.length) {
    // console.log('We have placed all groups');
    return g;
  }

  if (map[i] === '#' || map[i] === '?') {
    // Check if we can place a group here
    if (
      // The group fits before end of map
      i + groups[n] <= map.length &&
      // The group does not collide with '.'
      !map.slice(i, i + groups[n]).includes('.') &&
      //
      (i + groups[n] === map.length || !map[i + groups[n]].includes('#'))
    ) {
      // console.log('We can place a group here:', i);
      g += countArrangements(map, groups, i + groups[n] + 1, n + 1);
    }
  }

  // Cache result and return it
  cache[cacheKey] = g;
  tableRows = tableRows.map((row) => ({...row, g: cache[row.cacheKey]}));
  return g;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let arrangementsCount = 0;

  input.forEach((row, i) => {
    cache = {};
    arrangementsCount += countArrangements(row.map, row.groups, 0, 0, 0);
    console.table(tableRows);
    tableRows = [];
  });

  return arrangementsCount;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let arrangementsCount = 0;

  input.forEach((row, i) => {
    cache = {};

    const map = [row.map, row.map, row.map, row.map, row.map].join('?');
    const groups = [row.groups, row.groups, row.groups, row.groups, row.groups].flat();

    arrangementsCount += countArrangements(map, groups, 0, 0, 0);
    // console.table(tableRows);
    // tableRows = [];
  });

  return arrangementsCount;
};

run({
  part1: {
    tests: [
      {
        input: `
          ???.### 1,1,3
          .??..??...?##. 1,1,3
          ?#?#?#?#?#?#?#? 1,3,1,6
          ????.#...#... 4,1,1
          ????.######..#####. 1,6,5
          ?###???????? 3,2,1
        `,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          ???.### 1,1,3
          .??..??...?##. 1,1,3
          ?#?#?#?#?#?#?#? 1,3,1,6
          ????.#...#... 4,1,1
          ????.######..#####. 1,6,5
          ?###???????? 3,2,1
        `,
        expected: 525152,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
