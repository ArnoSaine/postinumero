import { LoginForm } from "@postinumero/react-router-oidc-client";
import { useLoginError } from "@postinumero/react-router-oidc-client";

export default function Login() {
  // return (
  //   <LoginRedirect
  //     intent="redirect"
  //     {...{ "extraQueryParams.kc_idp_hint": "suomi-fi" }}
  //   />
  // );

  const loginError = useLoginError();

  return (
    <div className="flex-grow flex flex-col items-center justify-center">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        <LoginForm className="mt-4">
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your username"
              required
              defaultValue="demo"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
              defaultValue="demo"
            />
          </div>
          {loginError && (
            <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-300 rounded p-2">
              {loginError.error_description}
            </div>
          )}
          <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-2">
            Login
          </button>
        </LoginForm>
        <LoginForm>
          <input
            type="hidden"
            name="extraQueryParams.kc_idp_hint"
            value="suomi-fi"
          />
          <button
            name="intent"
            value="redirect"
            className="w-full px-4 py-2 text-sm font-medium text-blue-500 border border-blue-500 rounded hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Suomi.fi
          </button>
        </LoginForm>
      </div>
    </div>
  );
}
