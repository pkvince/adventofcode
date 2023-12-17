import run from 'aocrunner';
import {evaluate} from 'mathjs';
import {arraySum} from '../utils/index.js';

type Rule = {
  exp?: string;
  dst: string;
};
type PartRating = {x: number; m: number; a: number; s: number};

const parseInput = (rawInput: string) => {
  const [rawWorkflows, rawPartRatings] = rawInput.split('\n\n');

  const workflows: Record<string, Rule[]> = rawWorkflows.split('\n').reduce((acc, rawWorkflow) => {
    const [name, rawRules] = rawWorkflow.replace('}', '').split('{');
    return {
      ...acc,
      [name]: rawRules.split(',').map((rawRule) => {
        let exp, dst;
        if (rawRule.includes(':')) {
          [exp, dst] = rawRule.split(':');
        } else {
          dst = rawRule;
        }

        return {exp, dst};
      }),
    };
  }, {});

  const partRatings: PartRating[] = rawPartRatings.split('\n').map((rawPart) => {
    return JSON.parse(rawPart.replace(/{/g, '{"').replace(/=/g, '":').replace(/,/g, ',"'));
  });

  return {workflows, partRatings};
};

const part1 = (rawInput: string) => {
  const {workflows, partRatings} = parseInput(rawInput);

  console.log(workflows, partRatings);

  let rejected = [];
  let accepted = [];
  for (const partRating of partRatings) {
    let w: string = 'in';

    while (w !== 'R' && w !== 'A') {
      const workflow = workflows[w];

      for (const rule of workflow) {
        const {exp, dst} = rule;

        if (!exp) {
          w = dst;
          break;
        }

        const result = evaluate(exp, partRating);

        if (result) {
          w = dst;
          break;
        }
      }

      if (w === 'R') {
        rejected.push(partRating);
        break;
      }

      if (w === 'A') {
        accepted.push(partRating);
        break;
      }
    }
  }

  return accepted.reduce((acc, part) => acc + arraySum(Object.values(part)), 0);
};

type PartRatingsConstraints = {
  x: {min: number; max: number};
  m: {min: number; max: number};
  a: {min: number; max: number};
  s: {min: number; max: number};
};
type Step = [workflowName: string, constraints: PartRatingsConstraints];

const part2 = (rawInput: string) => {
  const {workflows} = parseInput(rawInput);

  const getNextSteps = (workflowName: string, constraints: PartRatingsConstraints): Step[] => {
    const workflow = workflows[workflowName];
    const steps: Step[] = [];
    let nextContrainsts = {...constraints} as any;

    for (const rule of workflow) {
      const {exp, dst} = rule;

      if (!exp) {
        steps.push([dst, nextContrainsts]);
        break;
      }

      const [varName, operator, value] = exp.split(/([<>]+)/);
      if (operator === '<') {
        steps.push([
          dst,
          {
            ...nextContrainsts,
            [varName]: {
              ...nextContrainsts[varName],
              max: Math.min(Number(value) - 1, nextContrainsts[varName].max),
            },
          },
        ]);

        nextContrainsts = {
          ...nextContrainsts,
          [varName]: {
            ...nextContrainsts[varName],
            min: Math.max(Number(value), nextContrainsts[varName].min),
          },
        };
      } else if (operator === '>') {
        steps.push([
          dst,
          {
            ...nextContrainsts,
            [varName]: {
              ...nextContrainsts[varName],
              min: Math.max(Number(value) + 1, nextContrainsts[varName].min),
            },
          },
        ]);

        nextContrainsts = {
          ...nextContrainsts,
          [varName]: {
            ...nextContrainsts[varName],
            max: Math.min(Number(value), nextContrainsts[varName].max),
          },
        };
      } else {
        throw new Error('Invalid operator ' + operator);
      }
    }

    return steps;
  };

  const workingConstraints = [];
  let opened = [
    ...getNextSteps('in', {
      x: {min: 1, max: 4000},
      m: {min: 1, max: 4000},
      a: {min: 1, max: 4000},
      s: {min: 1, max: 4000},
    }),
  ];

  while (opened.length > 0) {
    const [workflowName, constraints] = opened.shift() as Step;

    if (workflowName === 'R') {
      continue;
    }

    if (workflowName === 'A') {
      workingConstraints.push(constraints);
      continue;
    }

    opened.push(...getNextSteps(workflowName, constraints));
  }

  const combinations = workingConstraints.reduce((acc, constraints) => {
    const x = constraints.x.max - constraints.x.min + 1;
    const m = constraints.m.max - constraints.m.min + 1;
    const a = constraints.a.max - constraints.a.min + 1;
    const s = constraints.s.max - constraints.s.min + 1;

    return acc + x * m * a * s;
  }, 0);

  return combinations;
};

run({
  part1: {
    tests: [
      {
        input: `
          px{a<2006:qkq,m>2090:A,rfg}
          pv{a>1716:R,A}
          lnx{m>1548:A,A}
          rfg{s<537:gd,x>2440:R,A}
          qs{s>3448:A,lnx}
          qkq{x<1416:A,crn}
          crn{x>2662:A,R}
          in{s<1351:px,qqz}
          qqz{s>2770:qs,m<1801:hdj,R}
          gd{a>3333:R,R}
          hdj{m>838:A,pv}
          
          {x=787,m=2655,a=1222,s=2876}
          {x=1679,m=44,a=2067,s=496}
          {x=2036,m=264,a=79,s=2244}
          {x=2461,m=1339,a=466,s=291}
          {x=2127,m=1623,a=2188,s=1013}
        `,
        expected: 19114,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          px{a<2006:qkq,m>2090:A,rfg}
          pv{a>1716:R,A}
          lnx{m>1548:A,A}
          rfg{s<537:gd,x>2440:R,A}
          qs{s>3448:A,lnx}
          qkq{x<1416:A,crn}
          crn{x>2662:A,R}
          in{s<1351:px,qqz}
          qqz{s>2770:qs,m<1801:hdj,R}
          gd{a>3333:R,R}
          hdj{m>838:A,pv}
          
          {x=787,m=2655,a=1222,s=2876}
          {x=1679,m=44,a=2067,s=496}
          {x=2036,m=264,a=79,s=2244}
          {x=2461,m=1339,a=466,s=291}
          {x=2127,m=1623,a=2188,s=1013}
        `,
        expected: 167409079868000,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
