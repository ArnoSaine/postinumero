import useCurrentUser from './useCurrentUser';

let hasRole = (user, { role }) =>
  user?.roles?.some(
    Array.isArray(role)
      ? (userRole) => role.includes(userRole)
      : (userRole) => role === userRole
  );

export const setHasRoleFn = (fn) => {
  hasRole = fn;
};

export default function useHasRole(opts) {
  return hasRole(useCurrentUser()[0], opts);
}
