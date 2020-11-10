import withAuth from './withAuth';

export default withAuth(function Auth({ children }) {
  return children;
});
