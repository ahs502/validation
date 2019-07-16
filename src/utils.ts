/**
 * A dictionary of the default messages for failed badges.
 * The keys are the badges itself or a badge glob (a * followed by a badge postfix or a badge prefix followed by a *) and
 * the values are the messages for when the validation is failing on those badges.
 */
export interface BadgeFailureMessages {
  readonly [badgeGlob: string]: string;
}

export function matchBadgeGlob<Badge extends string>(badge: Badge, badgeGlob: string): boolean {
  return (
    badgeGlob === badge ||
    (badgeGlob.startsWith('*') && badge.endsWith(badgeGlob.slice(1))) ||
    (badgeGlob.endsWith('*') && badge.startsWith(badgeGlob.slice(0, -1))) ||
    badgeGlob === '*'
  );
}

export function getBadgeMessage<Badge extends string>(badge: Badge, ...badgeFailureMessagesArray: BadgeFailureMessages[]): string | undefined {
  for (let i = 0; i < badgeFailureMessagesArray.length; ++i) {
    const badgeFailureMessages = badgeFailureMessagesArray[i];
    if (!badgeFailureMessages) break;
    const badgeGlobs = Object.keys(badgeFailureMessages);
    for (let j = 0; j < badgeGlobs.length; ++j) {
      const badgeGlob = badgeGlobs[j];
      const message = badgeFailureMessages[badgeGlob];
      if (matchBadgeGlob(badge, badgeGlob) && message) return message;
    }
  }
  return undefined;
}
