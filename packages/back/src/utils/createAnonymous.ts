import { User } from 'common';
import {
  adjectives,
  animals,
  uniqueNamesGenerator,
} from 'unique-names-generator';

export const createAnonymous = (anonymousId: string): User => {
  const randomNickname = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: ' ',
    seed: anonymousId,
    style: 'capital',
  });
  const randomProfileUrl = `https://api.dicebear.com/9.x/notionists/png?seed=${anonymousId}`;

  return {
    userId: anonymousId,
    nickname: randomNickname,
    profileUrl: randomProfileUrl,
    isAuthenticated: false,
  };
};
