import { useLoginLinkProps, useUser } from "@postinumero/react-router-oidc";
import { LogoutForm } from "@postinumero/react-router-oidc/components";
import { Link } from "react-router";

export default function AppBar() {
  const user = useUser();
  const loginLinkProps = useLoginLinkProps();

  return (
    <header className="bg-blue-600">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="text-white text-xl font-bold">
          React Router + OIDC example
        </div>
        <ul className="flex space-x-6">
          <li>
            <Link
              to="/"
              className="text-white text-sm font-medium hover:underline"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/other"
              className="text-white text-sm font-medium hover:underline"
            >
              Other
            </Link>
          </li>
          <li>
            <Link
              to="/admin"
              className="text-white text-sm font-medium hover:underline"
            >
              Admin
              <span className="ml-1 text-xs text-gray-200">
                (protected route)
              </span>
            </Link>
          </li>
          {user ? (
            <li>
              <LogoutForm>
                <button className="text-white text-sm font-medium hover:underline">
                  Logout
                </button>
              </LogoutForm>
            </li>
          ) : (
            <li>
              <Link
                {...loginLinkProps}
                className="text-white text-sm font-medium hover:underline"
              >
                Login
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
