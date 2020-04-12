import { $Base, $Path } from './$';
import BadgeFailureMessages from './BadgeFailureMessages';
import Chain from './Chain';

/**
 * The type of Validation internal state shared with the validator chains.
 */
export default interface Internal<Badge extends string, $ extends $Base> {
  /** The seed to produce unique indexes for each chain. */ counter: number;
  invalidate: () => void;
  badges: Badge[];
  errors: { [badge in Badge]?: string };
  $: $;
  $paths: $Path[];
  badgeFailureMessages: BadgeFailureMessages;
  /** Only named chains. */ chains: { [name: string]: Chain<Badge> };
  /** Only named chains. */ openedChains: string[];
  /** Only named chains. */ closedChains: string[];
  /** Only named chains. */ currentChain?: Chain<Badge>;
  done: boolean;
  promises: { [index: number]: Promise<void> };
  resolve: () => void;
  reject: (reason: any) => void;
}
