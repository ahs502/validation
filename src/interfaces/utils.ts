import { $Base } from '../utils/$';
import Validator from './Validator';

export interface Something {}

export type Provider<Data, T> = Data extends void ? (() => T) : Data extends boolean ? ((data: boolean) => T) : ((data: Data) => T);

export type ResultBoolean<T> = T extends boolean ? boolean : T;
export type ResultPromise<T> = T extends Promise<infer D> ? ResultBoolean<D> : ResultBoolean<T>;
export type ResultValidator<Badge extends string, $ extends $Base, T> = T extends Validator<Badge, $, infer D> ? ResultPromise<D> : ResultPromise<T>;
export type ResultProvider<Badge extends string, $ extends $Base, T> = T extends ((data: any) => infer U)
  ? ResultValidator<Badge, $, U>
  : ResultValidator<Badge, $, T>;
