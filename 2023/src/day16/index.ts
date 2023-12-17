import run from 'aocrunner';

enum Direction {
  Up = 'up',
  Right = 'right',
  Down = 'down',
  Left = 'left',
}

type Beam = {
  i: number;
  j: number;
  direction: Direction;
};

const energized = new Set<string>();
const visited = new Set<string>();

const step = (beams: Beam[], input: string[][]) => {
  // let b = beams.length;
  for (let b = 0; b < beams.length; b++) {
    energized.add(`${beams[b].i},${beams[b].j}`);

    if (visited.has(`${beams[b].i},${beams[b].j},${beams[b].direction}`)) {
      beams.splice(b, 1);
      b--;
      continue;
    }

    visited.add(`${beams[b].i},${beams[b].j},${beams[b].direction}`);

    // console.log(input[beams[b].i][beams[b].j]);

    // console.log(`Beam ${b}:`, beams[b].i, beams[b].j, beams[b].direction);

    switch (input[beams[b].i][beams[b].j]) {
      case '.':
        break;

      case '|':
        if (beams[b].direction === Direction.Up || beams[b].direction === Direction.Down) {
          break;
        }
        // console.log('splitting beam on |');
        beams[b].direction = Direction.Up;
        beams.unshift({i: beams[b].i + 1, j: beams[b].j, direction: Direction.Down});
        b++;
        break;

      case '-':
        if (beams[b].direction === Direction.Left || beams[b].direction === Direction.Right) {
          break;
        }
        // console.log('splitting beam on -');
        beams[b].direction = Direction.Left;
        beams.unshift({i: beams[b].i, j: beams[b].j + 1, direction: Direction.Right});
        b++;
        break;

      case '/':
        // console.log('redirecting on /');
        switch (beams[b].direction) {
          case Direction.Up:
            // console.log('redirecting right');
            beams[b].direction = Direction.Right;
            break;
          case Direction.Right:
            // console.log('redirecting up', beams[b]);
            beams[b].direction = Direction.Up;
            break;
          case Direction.Down:
            // console.log('redirecting left');
            beams[b].direction = Direction.Left;
            break;
          case Direction.Left:
            // console.log('redirecting down');
            beams[b].direction = Direction.Down;
            break;
        }
        break;

      case '\\':
        // console.log('redirecting on \\');
        switch (beams[b].direction) {
          case Direction.Up:
            // console.log('redirecting left');
            beams[b].direction = Direction.Left;
            break;
          case Direction.Right:
            // console.log('redirecting down');
            beams[b].direction = Direction.Down;
            break;
          case Direction.Down:
            // console.log('redirecting right');
            beams[b].direction = Direction.Right;
            break;
          case Direction.Left:
            // console.log('redirecting up');
            beams[b].direction = Direction.Up;
            break;
        }
        break;
    }

    switch (beams[b].direction) {
      case Direction.Up:
        beams[b].i--;
        break;
      case Direction.Right:
        beams[b].j++;
        break;
      case Direction.Down:
        beams[b].i++;
        break;
      case Direction.Left:
        beams[b].j--;
        break;
    }
  }

  for (let b = 0; b < beams.length; b++) {
    if (
      beams[b].i < 0 ||
      beams[b].i >= input.length ||
      beams[b].j < 0 ||
      beams[b].j >= input[beams[b].i].length
    ) {
      beams.splice(b, 1);
      b--;
    }
  }

  return;
};

const parseInput = (rawInput: string) => rawInput.split('\n').map((line) => line.split(''));

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const debug = input.length <= 10;

  energized.clear();
  visited.clear();

  if (debug) {
    for (let i = 0; i < input.length; i++) {
      console.log(input[i].join(''));
    }
  }

  let beams = [{i: 0, j: 0, direction: Direction.Right}];

  while (beams.length > 0) {
    step(beams, input);
  }

  if (debug) {
    for (let i = 0; i < input.length; i++) {
      for (let j = 0; j < input[i].length; j++) {
        energized.has(`${i},${j}`) ? process.stdout.write('#') : process.stdout.write('.');
      }
      process.stdout.write('\n');
    }
  }

  return energized.size;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const debug = input.length <= 10;

  let mostEnergized = 0;
  for (let i = 0; i < input.length; i++) {
    energized.clear();
    visited.clear();

    let beams = [{i, j: 0, direction: Direction.Right}];

    while (beams.length > 0) {
      step(beams, input);
    }
    mostEnergized = Math.max(energized.size, mostEnergized);

    energized.clear();
    visited.clear();

    beams = [{i, j: input.length - 1, direction: Direction.Left}];

    while (beams.length > 0) {
      step(beams, input);
    }
    mostEnergized = Math.max(energized.size, mostEnergized);
  }

  for (let j = 0; j < input[0].length; j++) {
    energized.clear();
    visited.clear();

    let beams = [{i: 0, j, direction: Direction.Down}];

    while (beams.length > 0) {
      step(beams, input);
    }
    mostEnergized = Math.max(energized.size, mostEnergized);

    energized.clear();
    visited.clear();

    beams = [{i: input[0].length - 1, j, direction: Direction.Up}];

    while (beams.length > 0) {
      step(beams, input);
    }
    mostEnergized = Math.max(energized.size, mostEnergized);
  }

  return mostEnergized;
};

run({
  part1: {
    tests: [
      {
        input: `
          .|...\\....
          |.-.\\.....
          .....|-...
          ........|.
          ..........
          .........\\
          ..../.\\\\..
          .-.-/..|..
          .|....-|.\\
          ..//.|....
        `,
        expected: 46,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          .|...\\....
          |.-.\\.....
          .....|-...
          ........|.
          ..........
          .........\\
          ..../.\\\\..
          .-.-/..|..
          .|....-|.\\
          ..//.|....
        `,
        expected: 51,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
