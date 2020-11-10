import {
  Auth,
  HasRole,
  IsAllowed,
  IsAuthenticated,
  useCurrentUser,
} from '@postinumero/react-auth';

function App() {
  const [, setUser] = useCurrentUser();
  return (
    <>
      <div>
        <IsAuthenticated
          fallback={
            <button
              onClick={() =>
                setUser({
                  email: 'email@example.com',
                  roles: ['a'],
                  rights: ['edit'],
                })
              }
            >
              Log in
            </button>
          }
        >
          <>
            <button onClick={() => setUser(null)}>Log out</button>
            <UserEmail />
          </>
        </IsAuthenticated>
      </div>
      <HasRole role="a">
        <div>Has role A ✔</div>
      </HasRole>
      <HasRole role="b" fallback="Does not have role B ✔">
        <div>Has role B ❌</div>
      </HasRole>
      <IsAllowed right="edit" fallback="Does not have right to edit ❌">
        <div>Has right to edit ✔</div>
      </IsAllowed>
    </>
  );
}

function UserEmail() {
  const [{ email }] = useCurrentUser();
  return <div>{email}</div>;
}

export default function AuthApp() {
  return (
    <Auth>
      <App />
    </Auth>
  );
}
