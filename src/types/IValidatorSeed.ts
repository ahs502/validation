import { $Base } from './general';
import IValidator from './IValidator';
import IValidatorChain from './IValidatorChain';

export default interface IValidatorSeed<Badge extends string, $ extends $Base> extends IValidator<Badge, $, undefined> {
  start(name: string, ...watches: any[]): IValidatorChain<Badge, $, undefined>;
}
