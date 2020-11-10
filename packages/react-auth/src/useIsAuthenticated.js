import useCurrentUser from './useCurrentUser';

let isAuthenticated = (user) => Boolean(user);

export const setIsAuthenticatedFn = (fn) => {
  isAuthenticated = fn;
};

export default function useIsAuthenticated(opts) {
  return isAuthenticated(useCurrentUser()[0], opts);
}
