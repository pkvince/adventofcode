import run from 'aocrunner';
import _ from 'lodash';

const parseInput = (rawInput: string) => rawInput.split('\n').slice(1);

const checkSize = (dir: {files: {size: number}[]}): number => {
  let filesSize = dir.files.reduce((acc, file) => acc + file.size, 0);

  const children = Object.keys(dir).filter((key) => key !== 'files');
  if (children.length === 0) return filesSize;

  return (
    filesSize +
    children.reduce((acc, child) => {
      const childDir = _.get(dir, child);
      return acc + checkSize(childDir);
    }, 0)
  );
};

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let directoriesPaths: string[] = [];
  const filesystem: any = {
    '/': {
      files: [],
    },
  };
  let cwd = ['/'];
  for (let i = 0; i < input.length; i++) {
    if (input[i].startsWith('$ ls')) {
      i++;
      while (i < input.length && !input[i].startsWith('$')) {
        const file = input[i].split(' ');
        if (file[0] === 'dir') {
          const newDirPath = [...cwd, file[1]].join('.');
          directoriesPaths.push(newDirPath);
          _.set(filesystem, newDirPath, {files: []});
        } else {
          const files = _.get(filesystem, [...cwd, 'files'].join('.'));
          files.push({name: file[1], size: parseInt(file[0])});
        }
        i++;
      }

      console.log(JSON.stringify(filesystem, null, 2));
    }

    if (i >= input.length) break;

    if (input[i] === '$ cd ..') {
      console.log(input[i]);
      cwd.pop();
    } else if (input[i].startsWith('$ cd')) {
      console.log(input[i]);
      const destination = input[i].replace('$ cd ', '');
      cwd.push(destination);
    }
  }

  let sum = 0;
  directoriesPaths.forEach((path) => {
    const dir = _.get(filesystem, path);
    const dirSize = checkSize(dir);
    console.log(path, dirSize);
    if (dirSize <= 100000) sum += dirSize;
  });

  return sum;
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  let directoriesPaths: string[] = [];
  const filesystem: any = {
    '/': {
      files: [],
    },
  };
  let cwd = ['/'];
  for (let i = 0; i < input.length; i++) {
    if (input[i].startsWith('$ ls')) {
      i++;
      while (i < input.length && !input[i].startsWith('$')) {
        const file = input[i].split(' ');
        if (file[0] === 'dir') {
          const newDirPath = [...cwd, file[1]].join('.');
          directoriesPaths.push(newDirPath);
          _.set(filesystem, newDirPath, {files: []});
        } else {
          const files = _.get(filesystem, [...cwd, 'files'].join('.'));
          files.push({name: file[1], size: parseInt(file[0])});
        }
        i++;
      }

      console.log(JSON.stringify(filesystem, null, 2));
    }

    if (i >= input.length) break;

    if (input[i] === '$ cd ..') {
      cwd.pop();
    } else if (input[i].startsWith('$ cd')) {
      cwd.push(input[i].replace('$ cd ', ''));
    }
  }

  const totalDiskSpace = 70000000;
  const minimumFreeSpace = 30000000;
  const totalSpaceUsed = checkSize(_.get(filesystem, '/'));
  const spaceToFree = minimumFreeSpace - (totalDiskSpace - totalSpaceUsed);

  const orderedDirSizes = directoriesPaths
    .map((path) => {
      const dir = _.get(filesystem, path);
      return checkSize(dir);
    })
    .sort();

  for (let size of orderedDirSizes) {
    if (size > spaceToFree) return size;
  }
};

const testInput = `
  $ cd /
  $ ls
  dir a
  14848514 b.txt
  8504156 c.dat
  dir d
  $ cd a
  $ ls
  dir e
  29116 f
  2557 g
  62596 h.lst
  $ cd e
  $ ls
  584 i
  $ cd ..
  $ cd ..
  $ cd d
  $ ls
  4060174 j
  8033020 d.log
  5626152 d.ext
  7214296 k
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
