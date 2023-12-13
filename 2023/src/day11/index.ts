import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n').map((line) => line.split(''));

const taxiDistance = (i1: number, j1: number, i2: number, j2: number) => {
  return Math.abs(i1 - i2) + Math.abs(j1 - j2);
};

const taxiDistanceWithWarpedTimeAndSpace = (
  i1: number,
  j1: number,
  i2: number,
  j2: number,
  emptyCols: number[],
  emptyRows: number[],
  timeWarp: number,
) => {
  let distance = Math.abs(i1 - i2) + Math.abs(j1 - j2);

  emptyRows.forEach((emptyRow) => {
    if ((i1 < emptyRow && i2 > emptyRow) || (i1 > emptyRow && i2 < emptyRow)) {
      return (distance += timeWarp - 1);
    }
  });
  emptyCols.forEach((emptyCol) => {
    if ((j1 < emptyCol && j2 > emptyCol) || (j1 > emptyCol && j2 < emptyCol)) {
      distance += timeWarp - 1;
    }
  });
  return distance;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  for (let i = 0; i < input.length; i++) {
    const line = input[i];
    if (line.every((char) => char === '.')) {
      input.splice(i + 1, 0, [...line]);
      i++;
    }
  }

  for (let j = 0; j < input[0].length; j++) {
    const column = input.map((line) => line[j]);
    if (column.every((char) => char === '.')) {
      for (let i = 0; i < input.length; i++) {
        input[i] = [...input[i].slice(0, j + 1), '.', ...input[i].slice(j + 1)];
      }
      j++;
    }
  }

  const galaxies = new Set<string>(); // i,j
  // Find all galaxies in the matrix (#)
  for (let i = 0; i < input.length; i++) {
    [...input[i].join('').matchAll(/#/g)].forEach((match) => {
      galaxies.add(`${i},${match.index}`);
    });
  }

  const galaxyPairs = new Set<string>(); // i1,j1/i2,j2
  galaxies.forEach((galaxy) => {
    const [i1, j1] = galaxy.split(',').map(Number);
    galaxies.forEach((otherGalaxy) => {
      const [i2, j2] = otherGalaxy.split(',').map(Number);
      if (i1 === i2 && j1 === j2) {
        return;
      }

      if (galaxyPairs.has(`${i2},${j2}/${i1},${j1}`)) return;

      galaxyPairs.add(`${i1},${j1}/${i2},${j2}`);
    });
  });

  return [...galaxyPairs].reduce((acc, pair) => {
    const [i1, j1] = pair.split('/')[0].split(',').map(Number);
    const [i2, j2] = pair.split('/')[1].split(',').map(Number);
    return acc + taxiDistance(i1, j1, i2, j2);
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const timeWarpedCoords = new Set<string>(); // i,j
  const emptyRows: number[] = [];
  const emptyCols: number[] = [];

  for (let i = 0; i < input.length; i++) {
    const line = input[i];
    if (line.every((char) => char === '.')) {
      emptyRows.push(i);
      for (let j = 0; j < line.length; j++) {
        timeWarpedCoords.add(`${i},${j}`);
      }
    }
  }

  for (let j = 0; j < input[0].length; j++) {
    const column = input.map((line) => line[j]);
    if (column.every((char) => char === '.')) {
      emptyCols.push(j);
      for (let i = 0; i < input.length; i++) {
        timeWarpedCoords.add(`${i},${j}`);
      }
    }
  }

  const galaxies = new Set<string>(); // i,j
  // Find all galaxies in the matrix (#)
  for (let i = 0; i < input.length; i++) {
    [...input[i].join('').matchAll(/#/g)].forEach((match) => {
      galaxies.add(`${i},${match.index}`);
    });
  }

  const galaxyPairs = new Set<string>(); // i1,j1/i2,j2
  galaxies.forEach((galaxy) => {
    const [i1, j1] = galaxy.split(',').map(Number);
    galaxies.forEach((otherGalaxy) => {
      const [i2, j2] = otherGalaxy.split(',').map(Number);
      if (i1 === i2 && j1 === j2) {
        return;
      }

      if (galaxyPairs.has(`${i2},${j2}/${i1},${j1}`)) return;

      galaxyPairs.add(`${i1},${j1}/${i2},${j2}`);
    });
  });

  const timeWarp = input.length > 100 ? 1000000 : 100;
  return [...galaxyPairs].reduce((acc, pair) => {
    const [i1, j1] = pair.split('/')[0].split(',').map(Number);
    const [i2, j2] = pair.split('/')[1].split(',').map(Number);
    return acc + taxiDistanceWithWarpedTimeAndSpace(i1, j1, i2, j2, emptyCols, emptyRows, timeWarp);
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
          ...#......
          .......#..
          #.........
          ..........
          ......#...
          .#........
          .........#
          ..........
          .......#..
          #...#.....
        `,
        expected: 374,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          ...#......
          .......#..
          #.........
          ..........
          ......#...
          .#........
          .........#
          ..........
          .......#..
          #...#.....
        `,
        expected: 8410,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
