import run from 'aocrunner';
import {impossible} from '../utils/index.js';
import _ from 'lodash';

type Point = [number, number];
const parseInput = (rawInput: string) => {
  const inputArray = rawInput
    .split('\n')
    .map((row) =>
      (
        row.match(
          /Sensor at x=([\+|\-]?\d+), y=([\+|\-]?\d+): closest beacon is at x=([\+|\-]?\d+), y=([\+|\-]?\d+)/,
        ) ?? impossible()
      )
        .slice(1)
        .map((coords) => parseInt(coords)),
    );

  const sensors = inputArray.map((row) => row.slice(0, 2) as Point);
  const beacons = inputArray.map((row) => row.slice(2) as Point);

  return {sensors, beacons};
};

const manhattanDistance = (p0: Point, p1: Point) => {
  const d1 = Math.abs(p1[0] - p0[0]);
  const d2 = Math.abs(p1[1] - p0[1]);

  return d1 + d2;
};

const part1 = (rawInput: string) => {
  const {sensors, beacons} = parseInput(rawInput);

  const row = sensors[0][0] === 2 ? 10 : 2000000;

  let minX = Infinity;
  let maxX = 0;
  let minY = Infinity;
  let maxY = 0;

  const manhattanDistances = Array.from({length: sensors.length}, (_, i) => {
    return manhattanDistance(sensors[i], beacons[i]);
  });

  for (let i = 0; i < sensors.length; i++) {
    const sensorMinX = sensors[i][0] - manhattanDistances[i];
    const sensorMaxX = sensors[i][0] + manhattanDistances[i];
    const sensorMinY = sensors[i][1] - manhattanDistances[i];
    const sensorMaxY = sensors[i][1] + manhattanDistances[i];
    if (minX > sensorMinX) minX = sensorMinX;
    if (maxX < sensorMaxX) maxX = sensorMaxX;
    if (minY > sensorMinY) minY = sensorMinY;
    if (maxY < sensorMaxY) maxY = sensorMaxY;
  }

  let count = 0;
  for (let i = minX; i <= maxX; i++) {
    if (beacons.find((beacon) => _.isEqual(beacon, [i, row]))) {
      continue;
    }

    // if in range of any sensor
    if (
      sensors.some((sensor, s) => {
        const sensorRange = manhattanDistances[s];
        const distanceFromSensor = manhattanDistance(sensor, [i, row]);

        return distanceFromSensor <= sensorRange;
      })
    ) {
      count++;
    }
  }

  return count;
};

const part2 = (rawInput: string) => {
  const {sensors, beacons} = parseInput(rawInput);

  const limit = sensors[0][0] === 2 ? 20 : 4000000;

  const manhattanDistances = Array.from({length: sensors.length}, (_, i) => {
    return manhattanDistance(sensors[i], beacons[i]);
  });

  const justOutOfReachPoints: string[] = [];

  let beaconFound: Point | null = null;
  const isOutOfReachOfEverySensor = ([x, y]: [number, number]) => {
    if (beacons.find((beacon) => _.isEqual(beacon, [x, y]))) {
      return false;
    }

    // if out of range of every
    if (
      sensors.every((sensor, s) => {
        const sensorRange = manhattanDistances[s];
        const distanceFromSensor = manhattanDistance(sensor, [x, y]);
        // console.log(sensorRange, distanceFromSensor);

        return distanceFromSensor > sensorRange;
      })
    ) {
      console.log('beacon found!!!', [x, y]);
      beaconFound = [x, y];
      return true;
    }
  };

  for (let s = 0; s < sensors.length; s++) {
    let x = 0;
    let y = 0;
    let range = manhattanDistances[s];

    const sensor = sensors[s];
    console.log('Starting sensor', sensor);

    x = sensor[0];
    y = sensor[1] - range - 1;
    if (x > 0 && x <= limit && y > 0 && y <= limit && isOutOfReachOfEverySensor([x, y])) break;

    while (y < sensor[1]) {
      x++;
      y++;
      if (x > 0 && x <= limit && y > 0 && y <= limit && isOutOfReachOfEverySensor([x, y])) break;
    }
    if (beaconFound) break;
    while (x > sensor[0]) {
      x--;
      y++;
      if (x > 0 && x <= limit && y > 0 && y <= limit && isOutOfReachOfEverySensor([x, y])) break;
    }
    if (beaconFound) break;
    while (y > sensor[1]) {
      x--;
      y--;
      if (x > 0 && x <= limit && y > 0 && y <= limit && isOutOfReachOfEverySensor([x, y])) break;
    }
    if (beaconFound) break;
    while (x < sensor[0]) {
      x++;
      y--;
      if (x > 0 && x <= limit && y > 0 && y <= limit && isOutOfReachOfEverySensor([x, y])) break;
    }
    if (beaconFound) break;
  }

  return (BigInt(4000000) * BigInt(beaconFound![0]) + BigInt(beaconFound![1])).toString();
};

const testInput = `
  Sensor at x=2, y=18: closest beacon is at x=-2, y=15
  Sensor at x=9, y=16: closest beacon is at x=10, y=16
  Sensor at x=13, y=2: closest beacon is at x=15, y=3
  Sensor at x=12, y=14: closest beacon is at x=10, y=16
  Sensor at x=10, y=20: closest beacon is at x=10, y=16
  Sensor at x=14, y=17: closest beacon is at x=10, y=16
  Sensor at x=8, y=7: closest beacon is at x=2, y=10
  Sensor at x=2, y=0: closest beacon is at x=2, y=10
  Sensor at x=0, y=11: closest beacon is at x=2, y=10
  Sensor at x=20, y=14: closest beacon is at x=25, y=17
  Sensor at x=17, y=20: closest beacon is at x=21, y=22
  Sensor at x=16, y=7: closest beacon is at x=15, y=3
  Sensor at x=14, y=3: closest beacon is at x=15, y=3
  Sensor at x=20, y=1: closest beacon is at x=15, y=3
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 26,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: '56000011',
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
