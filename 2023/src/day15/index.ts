import run from 'aocrunner';

const parseInput = (rawInput: string) => rawInput.split(',');

const hash = (input: string) => {
  let n = 0;
  for (let i = 0; i < input.length; i++) {
    n = ((n + input.charCodeAt(i)) * 17) % 256;
  }
  return n;
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    sum += hash(input[i]);
  }

  return sum;
};

const part2 = (rawInput: string) => {
  const steps = parseInput(rawInput);

  const boxes: Record<number, Map<string, number>> = {};
  for (const step of steps) {
    const [_, lensLabel, operation, focalLength] = [...(step.match(/([a-z]+)(-|=)(\d+)?/) ?? [])];
    const box = hash(lensLabel);
    if (!boxes[box]) boxes[box] = new Map();
    switch (operation) {
      case '-':
        boxes[box].delete(lensLabel);
        break;
      case '=':
        boxes[box].set(lensLabel, Number(focalLength));
        break;
    }
  }

  let sum = 0;
  for (const [h, box] of Object.entries(boxes)) {
    if (box.size === 0) {
      continue;
    }
    const lenses = [...box.values()];
    for (let i = 0; i < lenses.length; i++) {
      let product = Number(h) + 1;
      product = product * (i + 1) * lenses[i];
      sum += product;
    }
  }

  return sum;
};

run({
  part1: {
    tests: [
      {
        input: `HASH`,
        expected: 52,
      },
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 1320,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`,
        expected: 145,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
