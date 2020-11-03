import { useUser } from '.';

export default function Authenticated({ children = null, fallback = null }) {
  return useUser() ? children : fallback;
}
