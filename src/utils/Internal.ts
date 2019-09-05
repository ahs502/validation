import { $Base, $Path } from './$';
import BadgeFailureMessages from './BadgeFailureMessages';
import Chain from './Chain';

export default interface Internal<Badge extends string, $ extends $Base> {
  counter: number;
  invalidate: () => void;
  badges: Badge[];
  errors: { [badge in Badge]?: string };
  $: $;
  $paths: $Path[];
  badgeFailureMessages: BadgeFailureMessages;
  chains: { [name: string]: Chain<Badge> };
  openedChains: string[];
  closedChains: string[];
  currentChain?: Chain<Badge>;
  done: boolean;
  promises: { [index: number]: Promise<void> };
  resolve: () => void;
  reject: (reason: any) => void;
}
