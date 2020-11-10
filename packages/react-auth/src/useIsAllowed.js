import useCurrentUser from './useCurrentUser';

let isAllowed = (user, { right }) =>
  user?.rights?.some(
    Array.isArray(right)
      ? (userRight) => right.includes(userRight)
      : (userRight) => right === userRight
  );

export const setIsAllowedFn = (fn) => {
  isAllowed = fn;
};

export default function useIsAllowed(opts) {
  return isAllowed(useCurrentUser()[0], opts);
}
