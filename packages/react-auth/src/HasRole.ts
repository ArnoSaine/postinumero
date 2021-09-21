import renderChildrenOrFallback from './renderChildrenOrFallback.js';
import useHasRole from './useHasRole.js';

export default renderChildrenOrFallback(useHasRole, ({ role }) => role);
