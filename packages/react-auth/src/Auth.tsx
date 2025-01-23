import withAuth from './withAuth.js';

export default withAuth(function Auth({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
});
