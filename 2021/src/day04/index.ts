import run from 'aocrunner';

const parseInput = (rawInput: string) => {
  const inputParts = rawInput.split('\n\n');

  const numbers = inputParts[0].split(',');
  const boards = inputParts.slice(1).map((board) => {
    const rows = board.split('\n');
    const cells = rows.map((row) => row.trim().split(/\s+/));

    return cells;
  });

  return {numbers, boards};
};

function transpose(matrix: string[][]) {
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
}

const isBoardComplete = (board: string[][]) => {
  for (let i = 0; i < 5; i++) {
    if (board[i].every((cell) => cell.startsWith('*'))) return true;
  }
  const transposedBoard = transpose(board);
  for (let i = 0; i < 5; i++) {
    if (transposedBoard[i].every((cell) => cell.startsWith('*'))) return true;
  }
};

const sumBoard = (board: string[][]) => {
  return board.reduce((acc, row): number => {
    return (
      acc +
      row.reduce((acc, cell): number => {
        if (cell.startsWith('*')) return acc;

        return acc + parseInt(cell);
      }, 0)
    );
  }, 0);
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  for (let number of input.numbers) {
    for (let b = 0; b < input.boards.length; b++) {
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          if (input.boards[b][r][c] === number) {
            input.boards[b][r][c] = `*${number}`;
          }
        }
      }

      if (isBoardComplete(input.boards[b])) {
        console.log(input.boards[b], number, sumBoard(input.boards[b]) * parseInt(number));
        return sumBoard(input.boards[b]) * parseInt(number);
      }
    }
  }

  return;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  for (let number of input.numbers) {
    console.log('Checking number', number, 'on', input.boards.length, 'boards');
    for (let b = 0; b < input.boards.length; b++) {
      console.log('Trying number', number, 'on board', b);
      const isLastBoard = input.boards.length === 1;
      if (isLastBoard) console.log('IS LAST!!');

      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
          if (input.boards[b][r][c] === number) {
            console.log(number);
            input.boards[b][r][c] = `*${number}`;
          }
        }
      }

      console.log(input.boards[b], number, sumBoard(input.boards[b]) * parseInt(number));
      if (isBoardComplete(input.boards[b])) {
        console.log(`Board ${b} is complete!`);
        if (isLastBoard) {
          return sumBoard(input.boards[b]) * parseInt(number);
        } else {
          input.boards.splice(b, 1);
          b--;
        }
      }
    }
  }

  return;
};

const testInput = `
  7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

  22 13 17 11  0
   8  2 23  4 24
  21  9 14 16  7
   6 10  3 18  5
   1 12 20 15 19

   3 15  0  2 22
   9 18 13 17  5
  19  8  7 25 23
  20 11 10 24  4
  14 21 16 12  6

  14 21 17 24  4
  10 16 15  9 19
  18  8 23 26 20
  22 11 13  6  5
   2  0 12  3  7
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 4512,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 1924,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
