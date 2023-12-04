import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split('\n');

const part1 = (rawInput: string) => {
  const rows = parseInput(rawInput);

  // for (const row of rows) {
  //   console.log(row);
  // }

  let sum = 0;
  rows.forEach((row, i) => {
    const partNumbers = [...row.matchAll(/\d+/g)];

    for (const partNumber of partNumbers) {
      const xStart = partNumber.index!;
      const xEnd = xStart + partNumber[0].length - 1;

      // Left
      if (xStart > 0 && row[xStart - 1] !== '.') {
        sum += parseInt(partNumber[0]);
        continue;
      }

      // Right
      if (xEnd < row.length - 1 && row[xEnd + 1] !== '.') {
        sum += parseInt(partNumber[0]);
        continue;
      }

      // Top
      if (i > 0) {
        const above = rows[i - 1].slice(
          Math.max(0, xStart - 1),
          Math.min(xEnd + 1, row.length + 1) + 1,
        );
        if (Boolean(above.replace(/\./g, '0').match(/\D/))) {
          sum += parseInt(partNumber[0]);
          continue;
        }
      }

      // Bottom
      if (i < rows.length - 1) {
        const below = rows[i + 1].slice(
          Math.max(0, xStart - 1),
          Math.min(xEnd + 1, row.length + 1) + 1,
        );
        if (Boolean(below.replace(/\./g, '0').match(/\D/))) {
          sum += parseInt(partNumber[0]);
          continue;
        }
      }
    }
  });

  return sum;
};

const discoverPart = (row: string, matchIndex: number): number => {
  let val = row[matchIndex];

  // Check to the left
  let i = matchIndex - 1;
  while (i >= 0 && row[i].match(/\d/)) {
    val = `${row[i]}${val}`;
    i--;
  }

  // Then to the right
  i = matchIndex + 1;
  while (i < row.length && row[i].match(/\d/)) {
    val = `${val}${row[i]}`;
    i++;
  }

  return parseInt(val);
};

const part2 = (rawInput: string) => {
  const rows = parseInput(rawInput);

  // rows.forEach((row) => {
  //   console.log(row);
  // });

  let sum = 0;
  rows.forEach((row, i) => {
    const gears = [...row.matchAll(/\*/g)];
    if (!gears) return;

    for (const gear of gears) {
      const xStart = Math.max(0, gear.index! - 1);
      const xEnd = Math.min(gear.index! + 1, row.length - 1);
      const top = i > 0 ? rows[i - 1].substring(xStart, xEnd + 1) : '';
      const middle = row.substring(xStart, xEnd + 1);
      const bottom = i < rows.length - 1 ? rows[i + 1].substring(xStart, xEnd + 1) : '';

      const topParts = [...top.matchAll(/(\d+)/g)].map((match) => {
        const searchStart = Math.max(0, gear.index! - 1) + match.index!;
        return discoverPart(rows[i - 1], searchStart);
      });
      const middleParts = [...middle.matchAll(/(\d+)/g)].map((match) => {
        const searchStart = Math.max(0, gear.index! - 1) + match.index!;
        return discoverPart(row, searchStart);
      });
      const bottomParts = [...bottom.matchAll(/(\d+)/g)].map((match) => {
        const searchStart = Math.max(0, gear.index! - 1) + match.index!;
        return discoverPart(rows[i + 1], searchStart);
      });

      const nParts = topParts.length + middleParts.length + bottomParts.length;
      if (nParts !== 2) continue;

      const allParts = [...topParts, ...middleParts, ...bottomParts];

      sum += allParts[0]! * allParts[1];
    }
  });

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `
          467..114..
          ...*......
          ..35..633.
          ......#...
          617*......
          .....+.58.
          ..592.....
          ......755.
          ...$.*....
          .664.598..
        `,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          .2..
          *...
          2..*
        `,
        expected: 4,
      },
      {
        input: `
          ...10.
          .35*..
          ......
          .22*2.
          ......
        `,
        expected: 394,
      },
      {
        input: `
          467..114..
          ...*......
          ..35..633.
          ......#...
          617*......
          .....+.58.
          ..592.....
          ......755.
          ...$.*....
          .664.598..
        `,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
