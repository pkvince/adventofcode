import run from 'aocrunner';

enum Direction {
  Up = 'U',
  Down = 'D',
  Left = 'L',
  Right = 'R',
}

enum HexDirection {
  Right,
  Down,
  Left,
  Up,
}

const parseInput = (rawInput: string) =>
  rawInput.split('\n').map((line) => {
    const parts = line.split(' ');
    return {
      d: parts[0] as Direction,
      n: Number(parts[1]),
      color: parts[2].replace('(', '').replace(')', ''),
    };
  });

function calculatePolygonArea(vertices: number[][]): number {
  const numVertices = vertices.length;

  if (numVertices < 3) {
    // A polygon must have at least 3 vertices
    throw new Error('Invalid number of vertices for a polygon');
  }

  let area = 0;

  for (let i = 0; i < numVertices; i++) {
    const xi = vertices[i][0];
    const yi = vertices[i][1];

    const nextIndex = (i + 1) % numVertices;
    const xNext = vertices[nextIndex][0];
    const yNext = vertices[nextIndex][1];

    area += xi * yNext - xNext * yi;
  }

  area = Math.abs(area) / 2;

  return area;
}

function calculatePolygonPerimeter(vertices: number[][]): number {
  const numVertices = vertices.length;

  if (numVertices < 2) {
    throw new Error('Invalid number of vertices for a polygon');
  }

  let perimeter = 0;

  for (let i = 0; i < numVertices; i++) {
    const currentVertex = vertices[i];
    const nextIndex = (i + 1) % numVertices;
    const nextVertex = vertices[nextIndex];

    const dx = nextVertex[0] - currentVertex[0];
    const dy = nextVertex[1] - currentVertex[1];

    perimeter += Math.sqrt(dx * dx + dy * dy);
  }

  return perimeter;
}

const part1 = (rawInput: string) => {
  const instructions = parseInput(rawInput);

  const vertices = [[0, 0]];

  for (let i = 0; i < instructions.length; i++) {
    const lastVertex = vertices[vertices.length - 1];
    switch (instructions[i].d) {
      case Direction.Up:
        vertices.push([lastVertex[0], lastVertex[1] - instructions[i].n]);
        break;
      case Direction.Down:
        vertices.push([lastVertex[0], lastVertex[1] + instructions[i].n]);
        break;
      case Direction.Left:
        vertices.push([lastVertex[0] - instructions[i].n, lastVertex[1]]);
        break;
      case Direction.Right:
        vertices.push([lastVertex[0] + instructions[i].n, lastVertex[1]]);
        break;
    }
  }

  const area = calculatePolygonArea(vertices);
  const perimeter = calculatePolygonPerimeter(vertices);

  const discreteArea = area + (perimeter + 2) / 2;

  // reduce vertices into an area
  return discreteArea;
};

function plotVertices(vertices: number[][]): void {
  const matrixSize = 20; // Adjust the size of the matrix as needed

  // Initialize the matrix with dots
  const map: string[][] = Array.from({length: matrixSize}, () => {
    return Array.from({length: matrixSize}, () => '.');
  });

  // Plot vertices on the matrix
  for (const [i, j] of vertices) {
    const offseti = i;
    const offsetj = j;
    if (offseti >= 0 && offseti < matrixSize && offsetj >= 0 && offsetj < matrixSize) {
      map[offsetj][offseti] = 'X'; // Assuming (i, j) coordinates
    }
  }

  // Print the matrix
  for (let i = 0; i < matrixSize; i++) {
    console.log(map[i].join(''));
  }
}

const part2 = (rawInput: string) => {
  const instructions = parseInput(rawInput);

  const vertices = [[0, 0]];

  for (let i = 0; i < instructions.length; i++) {
    const n = parseInt(instructions[i].color.slice(1, 6), 16);
    const d = Number(instructions[i].color.slice(-1)) as HexDirection;
    const lastVertex = vertices[vertices.length - 1];
    switch (d) {
      case HexDirection.Up:
        vertices.push([lastVertex[0], lastVertex[1] - n]);
        break;
      case HexDirection.Down:
        vertices.push([lastVertex[0], lastVertex[1] + n]);
        break;
      case HexDirection.Left:
        vertices.push([lastVertex[0] - n, lastVertex[1]]);
        break;
      case HexDirection.Right:
        vertices.push([lastVertex[0] + n, lastVertex[1]]);
        break;
    }
  }

  const area = calculatePolygonArea(vertices);
  const perimeter = calculatePolygonPerimeter(vertices);

  const discreteArea = area + (perimeter + 2) / 2;

  return discreteArea;
};

run({
  part1: {
    tests: [
      {
        input: `
          R 6 (#70c710)
          D 5 (#0dc571)
          L 2 (#5713f0)
          D 2 (#d2c081)
          R 2 (#59c680)
          D 2 (#411b91)
          L 5 (#8ceee2)
          U 2 (#caa173)
          L 1 (#1b58a2)
          U 2 (#caa171)
          R 2 (#7807d2)
          U 3 (#a77fa3)
          L 2 (#015232)
          U 2 (#7a21e3)
        `,
        expected: 62,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          R 6 (#70c710)
          D 5 (#0dc571)
          L 2 (#5713f0)
          D 2 (#d2c081)
          R 2 (#59c680)
          D 2 (#411b91)
          L 5 (#8ceee2)
          U 2 (#caa173)
          L 1 (#1b58a2)
          U 2 (#caa171)
          R 2 (#7807d2)
          U 3 (#a77fa3)
          L 2 (#015232)
          U 2 (#7a21e3)
        `,
        expected: 952408144115,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
