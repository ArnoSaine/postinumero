import { RolesRights, User } from './index.js';
import useCurrentUser from './useCurrentUser.js';

let hasRole = (user: User, role: RolesRights) =>
  user?.roles?.some(
    Array.isArray(role)
      ? (userRole) => role.includes(userRole)
      : (userRole) => role === userRole
  ) ?? false;

export const setHasRoleFn = (fn: typeof hasRole) => {
  hasRole = fn;
};

export default function useHasRole(role: RolesRights) {
  return hasRole(useCurrentUser(), role);
}
