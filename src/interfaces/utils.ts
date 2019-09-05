import { $Base } from '../utils/$';
import Validator from './Validator';
import ValidatorAsync from './ValidatorAsync';

export interface Something {}

export type Provider<Data, T> = Data extends void ? (() => T) : Data extends boolean ? ((data: boolean) => T) : ((data: Data) => T);

export type Result<Badge extends string, $ extends $Base, Data, T> = T extends
  | Promise<infer D>
  | ValidatorAsync<Badge, $, infer D>
  | ((data: Data) => Promise<infer D>)
  | ((data: Data) => ValidatorAsync<Badge, $, infer D>)
  ? Promise<D>
  : T extends Validator<Badge, $, infer D> | ((data: Data) => Validator<Badge, $, infer D>)
  ? D
  : T extends ((data: Data) => infer D)
  ? D
  : T;

export type Value<Badge extends string, $ extends $Base, Data, T> = Result<Badge, $, Data, T> extends Promise<infer D0> ? D0 : Result<Badge, $, Data, T>;
