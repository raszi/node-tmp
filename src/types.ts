export type WithDefault = Record<string, unknown>;

export type WithPrefix = {
  prefix: string;
};

export type WithPostfix = {
  postfix: string;
};

export type WithAffix = WithPrefix & WithPostfix;

export type WithTemplate = {
  template: string;
};

export type WithFixed = {
  name: string;
};

export type NameOptions = WithDefault | WithPrefix | WithPostfix | WithAffix | WithTemplate | WithFixed;

export type Options = NameOptions & {
  dir?: string;
  tmpdir?: string;
  tries?: number;
};

export type OptionalAsyncFunction<T, R> = ((input: T) => Promise<R>) | ((input: T) => R);
