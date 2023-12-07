import run from 'aocrunner';

const parseInput = (rawInput: string) =>
  rawInput
    .replace('seeds: ', '')
    .replace(/\n\S+\smap\:/gm, '')
    .split('\n\n')
    .reduce(
      (acc, curr, index) => {
        switch (index) {
          case 0:
            return {...acc, seeds: curr.split(' ').map(Number)};
          default:
            return {
              ...acc,
              maps: [...(acc.maps ?? []), curr.split('\n').map((r) => r.split(' ').map(Number))],
            };
        }
      },
      {seeds: [] as number[], maps: [] as number[][][]},
    );

const findDestination = (source: number, map: number[][]): number => {
  for (const [dst, src, rng] of map) {
    if (source >= src && source < src + rng) {
      return source - src + dst;
    }
  }

  return source;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let minLoc;
  for (const seed of input.seeds) {
    let source = seed;
    let destination;
    for (const map of input.maps) {
      destination = findDestination(source!, map);
      source = destination;
    }

    if (!minLoc || minLoc > destination!) minLoc = destination;
  }

  return minLoc;
};

type Range = {
  start: number;
  length: number;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const seedsRange: Range[] = [];
  for (let i = 0; i < input.seeds.length; i += 2) {
    seedsRange.push({start: input.seeds[i], length: input.seeds[i + 1]});
  }

  let minLoc;
  for (const seedRange of seedsRange) {
    // if (seedRange.start !== 20816377) continue;
    for (let i = seedRange.start; i < seedRange.start + seedRange.length; i++) {
      // if (i < 529380000) continue;
      let source = i;
      let destination;
      for (const map of input.maps) {
        destination = findDestination(source, map);
        source = destination;
      }

      if (!minLoc || minLoc > destination!) {
        minLoc = destination;
        // console.log('Found new min in seed range', seedRange, i, minLoc);
      }
    }
  }

  return minLoc;
};

run({
  part1: {
    tests: [
      {
        input: `
          seeds: 79 14 55 13

          seed-to-soil map:
          50 98 2
          52 50 48
          
          soil-to-fertilizer map:
          0 15 37
          37 52 2
          39 0 15
          
          fertilizer-to-water map:
          49 53 8
          0 11 42
          42 0 7
          57 7 4
          
          water-to-light map:
          88 18 7
          18 25 70
          
          light-to-temperature map:
          45 77 23
          81 45 19
          68 64 13
          
          temperature-to-humidity map:
          0 69 1
          1 0 69
          
          humidity-to-location map:
          60 56 37
          56 93 4
        `,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          seeds: 79 14 55 13

          seed-to-soil map:
          50 98 2
          52 50 48
          
          soil-to-fertilizer map:
          0 15 37
          37 52 2
          39 0 15
          
          fertilizer-to-water map:
          49 53 8
          0 11 42
          42 0 7
          57 7 4
          
          water-to-light map:
          88 18 7
          18 25 70
          
          light-to-temperature map:
          45 77 23
          81 45 19
          68 64 13
          
          temperature-to-humidity map:
          0 69 1
          1 0 69
          
          humidity-to-location map:
          60 56 37
          56 93 4
        `,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
