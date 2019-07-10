export type Message = string;

type Badge<K extends string> = K | { readonly badge: K; readonly message: Message };
export default Badge;

/**
 * A dictionary of the default messages for failed badges.
 * The keys are the badges itself or a badge glob (a * followed by a badge postfix or a badge prefix followed by a *) and
 * the values are the messages for when the validation is failing on those badges.
 */
export interface BadgeFailureMessages {
  readonly [badgeGlob: string]: Message;
}
