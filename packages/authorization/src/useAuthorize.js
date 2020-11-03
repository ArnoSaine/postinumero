import { useUser } from '.';

export default function useAuthorize({ allow = [] }) {
  const allowedRoles = Array.isArray(allow) ? allow : [allow];
  return useUser()?.roles?.some((role) => allowedRoles.includes(role));
}
