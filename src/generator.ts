import { randomBytes } from 'crypto';

import { NameOptions, WithFixed, WithPostfix, WithPrefix, WithTemplate } from './types';

const isPostfix = (options: NameOptions): options is WithPostfix => {
  return (options as WithPostfix).postfix !== undefined;
};

const isPrefix = (options: NameOptions): options is WithPrefix => {
  return (options as WithPrefix).prefix !== undefined;
};

const isTemplate = (options: NameOptions): options is WithTemplate => {
  return (options as WithTemplate).template !== undefined;
};

const isFixed = (options: NameOptions): options is WithFixed => {
  return (options as WithFixed).name !== undefined;
};

type WithConstraints = {
  prefix?: string;
  postfix?: string;
};

const unwantedBase64Chars = new RegExp('[+=/]', 'g');

export const randomChars = (length: number) =>
  randomBytes(length).toString('base64').replace(unwantedBase64Chars, '').slice(0, length);

const affixGenerator = ({ prefix = 'tmp', postfix }: WithConstraints): Generator => {
  return () => [prefix, process.pid, randomChars(20), postfix].filter(Boolean).join('-');
};

const templatePattern = /XXXXXX/;

const templateGenerator = ({ template }: WithTemplate): Generator => {
  return () => template.replace(templatePattern, randomChars(6));
};

type Generator = () => string;

export function initGenerator(options: NameOptions): Generator {
  if (isFixed(options)) {
    return () => options.name;
  }

  if (isTemplate(options)) {
    return templateGenerator(options);
  }

  if (isPrefix(options) || isPostfix(options)) {
    return affixGenerator(options);
  }

  return affixGenerator({ prefix: 'tmp' });
}
