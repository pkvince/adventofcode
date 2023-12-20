import run from 'aocrunner';

const lcm = (...arr: number[]): number => {
  const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
  const lcm = (x: number, y: number): number => (x * y) / gcd(x, y);
  return [...arr].reduce(lcm);
};

enum Signal {
  Low = 0,
  High = 1,
}

type Pulse = {
  from: string;
  to: string;
  signal: Signal;
};

enum Type {
  Button = 'button',
  FlipFlop = 'flipflop',
  Conjunction = 'conjunction',
  Broadcaster = 'broadcaster',
}

type Module =
  | {
      type: Type.Button;
      id: Type.Button;
      destinations: [Type.Broadcaster];
    }
  | {
      type: Type.Broadcaster;
      id: Type.Broadcaster;
      destinations: string[];
    }
  | {
      type: Type.FlipFlop;
      id: string;
      value: 0 | 1;
      destinations: string[];
    }
  | {
      type: Type.Conjunction;
      id: string;
      lastSignalForInput: Record<string, Signal>;
      destinations: string[];
    };

const parseInput = (rawInput: string): Record<string, Module> =>
  rawInput
    .split('\n')
    .map((line) => {
      const [module, destinations] = line.split(' -> ');
      if (module === 'broadcaster') {
        return {
          type: Type.Broadcaster,
          id: Type.Broadcaster,
          destinations: destinations.split(', '),
        };
      }
      if (module[0] === '%') {
        // FlipFlop
        return {
          type: Type.FlipFlop,
          id: module.slice(1)!,
          value: 0,
          destinations: destinations.split(', '),
        };
      }
      if (module[0] === '&') {
        // Conjunction
        return {
          type: Type.Conjunction,
          id: module.slice(1)!,
          lastSignalForInput: {},
          destinations: destinations.split(', '),
        };
      }
    })
    .reduce((acc, module) => {
      return {...acc, [module!.id!]: module};
    }, {});

const part1 = (rawInput: string) => {
  const modules = parseInput(rawInput);

  for (const [id, module] of Object.entries(modules)) {
    if (!('destinations' in module)) continue;

    for (const destination of module.destinations) {
      const destModule = modules[destination];
      if (destModule && 'lastSignalForInput' in destModule) {
        destModule.lastSignalForInput[id] = Signal.Low;
      }
    }
  }

  const pulsesProcessed = {
    [Signal.Low]: 0,
    [Signal.High]: 0,
  };

  for (let i = 0; i < 1000; i++) {
    const pulses: Pulse[] = [{from: 'button', to: 'broadcaster', signal: Signal.Low}];
    while (pulses.length > 0) {
      const pulse = pulses.shift()!;
      pulsesProcessed[pulse.signal]++;
      const module = modules[pulse.to];

      if (!module) {
        continue;
      } else if (module.type === Type.Broadcaster) {
        module.destinations.forEach((destination) => {
          pulses.push({from: module.id, to: destination, signal: pulse.signal});
        });
      } else if (module.type === Type.FlipFlop) {
        if (pulse.signal === Signal.High) continue; // Ignore high pulses

        module.value = module.value === 0 ? 1 : 0;
        module.destinations.forEach((destination) => {
          pulses.push({
            from: module.id,
            to: destination,
            signal: module.value === 1 ? Signal.High : Signal.Low,
          });
        });
      } else if (module.type === Type.Conjunction) {
        module.lastSignalForInput = {...module.lastSignalForInput, [pulse.from]: pulse.signal};
        const nextPulseSignal = Object.values(module.lastSignalForInput).every(
          (lastPulse) => lastPulse === Signal.High,
        )
          ? Signal.Low
          : Signal.High;

        module.destinations.forEach((destination) => {
          pulses.push({from: module.id, to: destination, signal: nextPulseSignal});
        });
      }
    }
  }

  return pulsesProcessed[Signal.High] * pulsesProcessed[Signal.Low];
};

const part2 = (rawInput: string) => {
  const modules = parseInput(rawInput);
  modules.rx = {type: Type.Conjunction, id: 'rx', lastSignalForInput: {}, destinations: []};

  for (const [id, module] of Object.entries(modules)) {
    if (!('destinations' in module)) continue;

    for (const destination of module.destinations) {
      const destModule = modules[destination];
      if (destModule && 'lastSignalForInput' in destModule) {
        destModule.lastSignalForInput[id] = Signal.Low;
      }
    }
  }

  let nButtonsPressed = 0;
  const periods: Record<string, number> = {};
  let leastCommonMultipleOfAllPeriods;
  while (true) {
    nButtonsPressed++;
    const pulses: Pulse[] = [{from: 'button', to: 'broadcaster', signal: Signal.Low}];
    while (pulses.length > 0) {
      const pulse = pulses.shift()!;
      const module = modules[pulse.to];

      if (!module) {
        continue;
      } else if (module.type === Type.Broadcaster) {
        module.destinations.forEach((destination) => {
          pulses.push({from: module.id, to: destination, signal: pulse.signal});
        });
      } else if (module.type === Type.FlipFlop) {
        if (pulse.signal === Signal.High) continue; // Ignore high pulses

        module.value = module.value === 0 ? 1 : 0;
        module.destinations.forEach((destination) => {
          pulses.push({
            from: module.id,
            to: destination,
            signal: module.value === 1 ? Signal.High : Signal.Low,
          });
        });
      } else if (module.type === Type.Conjunction) {
        if (module.id === 'df' && pulse.signal === Signal.High) {
          periods[pulse.from] = nButtonsPressed;
          if (Object.keys(periods).length === Object.keys(module.lastSignalForInput).length) {
            leastCommonMultipleOfAllPeriods = lcm(...Object.values(periods));
            // console.log('Found!', leastCommonMultipleOfAllPeriods);
            break;
          }
        }

        module.lastSignalForInput = {...module.lastSignalForInput, [pulse.from]: pulse.signal};
        const nextPulseSignal = Object.values(module.lastSignalForInput).every(Boolean)
          ? Signal.Low
          : Signal.High;

        module.destinations.forEach((destination) => {
          pulses.push({from: module.id, to: destination, signal: nextPulseSignal});
        });
      }
    }

    if (leastCommonMultipleOfAllPeriods) return leastCommonMultipleOfAllPeriods;
  }
};

run({
  part1: {
    tests: [
      {
        input: `
          broadcaster -> a, b, c
          %a -> b
          %b -> c
          %c -> inv
          &inv -> a
        `,
        expected: 32000000,
      },
      {
        input: `
          broadcaster -> a
          %a -> inv, con
          &inv -> b
          %b -> con
          &con -> output
        `,
        expected: 11687500,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
