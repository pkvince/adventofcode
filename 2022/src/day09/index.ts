import run from 'aocrunner';

type Pos = {
  x: number;
  y: number;
};

const parseInput = (rawInput: string) =>
  rawInput.split('\n').map((move) => {
    const moveParts = move.trim().split(' ');

    return {
      direction: moveParts[0],
      amount: parseInt(moveParts[1]),
    };
  });

const printPositions = (h: Pos, t: Pos): void => {
  const xSize = 40;
  const ySize = 40;

  for (let y = ySize; y >= 0; y--) {
    let row = ``;
    for (let x = 0; x < xSize; x++) {
      let cell = '.';
      if (x === h.x && y === h.y) cell = 'H';
      if (x === t.x && y === t.y) cell = 'T';

      row += `${cell} `;
    }
    // console.log(row);
  }
};

function coverGap(h: Pos, t: Pos): Pos {
  // console.log(h, t);
  const horDist = h.x - t.x;
  const vertDist = h.y - t.y;

  if (Math.abs(horDist) > 1 || Math.abs(vertDist) > 1) {
    const newPos = {
      x: horDist === 0 ? t.x : t.x + (horDist < 0 ? -1 : 1),
      y: vertDist === 0 ? t.y : t.y + (vertDist < 0 ? -1 : 1),
    };

    return newPos;
  }

  return t;
}

const part1 = (rawInput: string) => {
  const moves = parseInput(rawInput);

  let h = {x: 0, y: 0};
  let t = {x: 0, y: 0};
  let visitedTPos = new Set<string>([]);

  for (let move of moves) {
    Array.from({length: move.amount}).forEach(() => {
      switch (move.direction) {
        case 'U':
          h.y++;
          break;
        case 'D':
          h.y--;
          break;
        case 'L':
          h.x--;
          break;
        case 'R':
          h.x++;
          break;
      }
      t = coverGap(h, t);
      // console.log(printPositions(h, t));
      // console.log('');
      visitedTPos.add(`${t.x},${t.y}`);
    });
  }

  // console.log(visitedTPos);

  return visitedTPos.size;
};

const printPositions2 = (knots: Pos[]): void => {
  const xSize = 40;
  const ySize = 40;

  for (let y = ySize; y >= 0; y--) {
    let row = ``;
    for (let x = 0; x < xSize; x++) {
      let cell = '.';
      for (let i = 0; i < knots.length; i++) {
        if (x === knots[i].x && y === knots[i].y && cell === '.') {
          i === 0 ? (cell = 'H') : (cell = i.toString());
        }
      }

      row += `${cell} `;
    }
    console.log(row);
  }
};

const part2 = (rawInput: string) => {
  const moves = parseInput(rawInput);
  let initialPos = {x: 0, y: 0};
  let knots = Array.from({length: 10}, () => ({...initialPos}));
  let visitedPositions = new Set<string>([]);

  for (let move of moves) {
    console.log('Move', move);
    console.log('');

    Array.from({length: move.amount}).forEach(() => {
      console.log('h pos', knots[0]);

      switch (move.direction) {
        case 'U':
          knots[0].y++;
          break;
        case 'D':
          knots[0].y--;
          break;
        case 'L':
          knots[0].x--;
          break;
        case 'R':
          knots[0].x++;
          break;
      }

      console.log('moved to', knots[0]);

      knots.slice(1).forEach((_, i) => {
        console.log(knots[i], knots[i + 1]);
        knots[i + 1] = coverGap(knots[i], knots[i + 1]);
        console.log('moved to', knots[i + 1]);
      });

      visitedPositions.add(`${knots[9].x},${knots[9].y}`);
    });

    console.log(printPositions2(knots));
    console.log('');
    // return 0;
  }

  // console.log(visitedPositions);

  return visitedPositions.size;
};

const testInput = `
  R 4
  U 4
  L 3
  D 1
  R 4
  D 1
  L 5
  R 2
`;

const testInput2 = `
  R 5
  U 8
  L 8
  D 3
  R 17
  D 10
  L 25
  U 20
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput2,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
