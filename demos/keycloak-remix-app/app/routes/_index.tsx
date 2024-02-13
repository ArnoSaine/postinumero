import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <ul>
      <li>
        <Link to="/about">Go to the about page</Link>
      </li>
      <li>
        <Link to="/private">Go to the private page</Link>
      </li>
      <li>
        <Link to="/admin">Go to the admin page</Link>
      </li>
      <li>
        <Link to="/super-admin">Go to the super-admin page</Link>
      </li>
    </ul>
  );
}
