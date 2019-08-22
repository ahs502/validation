export type $Field = string | number | boolean | bigint | Date; //TODO: Add more basic values;
type $Recursive = $Field | { [key: string]: $Recursive } | $Array;
interface $Array extends ReadonlyArray<$Recursive> {}
export interface $Base {
  [key: string]: $Recursive;
}

type $Step = string | number;
export type $Path = ($Step)[];

export function set$($: any, path: $Path, value: any): void {
  const [$$, step] = approach$($, path);
  $$[step] = value;
}
export function get$($: any, path: $Path): any {
  const [$$, step] = approach$($, path);
  return $$[step];
}
function approach$($: any, path: $Path): [any, $Step] {
  path.slice(0, -1).forEach((property, index) => {
    if (!$[property]) {
      const nextProperty = path[index + 1];
      $[property] = typeof nextProperty === 'number' ? [] : {};
    }
    $ = $[property];
  });
  return [$, path[path.length - 1]];
}
