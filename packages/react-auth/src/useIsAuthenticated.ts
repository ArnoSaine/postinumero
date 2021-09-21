import { User } from './index.js';
import useCurrentUser from './useCurrentUser.js';

let isAuthenticated = (user: User) => Boolean(user);

export const setIsAuthenticatedFn = (fn: typeof isAuthenticated) => {
  isAuthenticated = fn;
};

export default function useIsAuthenticated() {
  return isAuthenticated(useCurrentUser());
}
