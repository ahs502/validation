export type $Field = string | number | boolean | bigint | Date; //TODO: Add more basic values;
type $Recursive = $Field | { [key: string]: $Recursive } | $Array;
interface $Array extends ReadonlyArray<$Recursive> {}
export interface $Base {
  [key: string]: $Recursive;
}

export interface BadgeFailureMessages {
  readonly [badgeGlob: string]: string;
}

export interface Chain<Badge extends string> {
  name: string;
  watches: any[];
  data: any;
  effects: {
    invalidates: boolean;
    badges: Badge[];
    errors: { [badge in Badge]?: string };
    $: {
      path: (string | number)[];
      value: any;
    }[];
  };
}

// interface Tail {
//   method: string;
//   args: any[];
// }

// export interface AsyncHandler {
//   promise: Promise<any>;
//   tail: Tail[];
// }

// export interface PendingHandler {
//   names: string[];
//   validator: any;
//   tail: Tail[];
// }

export interface Internal<Badge extends string, $ extends $Base> {
  invalidate: () => void;
  badges: Badge[];
  errors: { [badge in Badge]?: string };
  $: $;
  badgeFailureMessages: BadgeFailureMessages;
  chains: { [name: string]: Chain<Badge> };
  openedChains: string[];
  closedChains: string[];
  currentChain?: Chain<Badge>;
  done: boolean;
  exception?: string;
  asyncResolve: (value?: any) => void;
  asyncReject: (reason?: any) => void;
}
