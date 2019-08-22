export default interface BadgeFailureMessages {
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

export function getBadgeFailureMessage<Badge extends string>(badge: Badge, ...badgeFailureMessagesList: BadgeFailureMessages[]): string | undefined {
  for (let i = 0; i < badgeFailureMessagesList.length; ++i) {
    const badgeFailureMessages = badgeFailureMessagesList[i];
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
