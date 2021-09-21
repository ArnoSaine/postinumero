import { RolesRights, User } from './index.js';
import useCurrentUser from './useCurrentUser.js';

let isAllowed = (user: User, right: RolesRights) =>
  user?.rights?.some(
    Array.isArray(right)
      ? (userRight) => right.includes(userRight)
      : (userRight) => right === userRight
  ) ?? false;

export const setIsAllowedFn = (fn: typeof isAllowed) => {
  isAllowed = fn;
};

export default function useIsAllowed(right: RolesRights) {
  return isAllowed(useCurrentUser(), right);
}
