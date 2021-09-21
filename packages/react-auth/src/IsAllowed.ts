import renderChildrenOrFallback from './renderChildrenOrFallback.js';
import useIsAllowed from './useIsAllowed.js';

export default renderChildrenOrFallback(useIsAllowed, ({ right }) => right);
