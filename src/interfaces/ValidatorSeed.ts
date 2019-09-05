import { $Base } from '../utils/$';
import Validator from './Validator';
import ValidatorChain from './ValidatorChain';

export default interface ValidatorSeed<Badge extends string, $ extends $Base> extends Validator<Badge, $, undefined> {
  /**
   * TODO
   */
  readonly $: $;

  /**
   * TODO
   */
  start(name: string, ...watches: any[]): ValidatorChain<Badge, $, undefined>;
}
