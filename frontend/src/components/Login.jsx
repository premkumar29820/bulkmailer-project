import { useState } from "react";
import axios from "axios";

const Login = ({ onLogin }) => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const [status, setstatus] = useState(false);

  const handlesubmit = async (e) => {
    e.preventDefault();
    seterror("");
    setstatus(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        onLogin();
      }
    } catch (error) {
      seterror(
        error.response?.data?.message || "Login failed"
      );
    }

    setstatus(false);
  };

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-8 flex items-center justify-center">

      <div className="w-full max-w-md">

        {/* Login Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Header */}
          <div className="border-b border-gray-100 px-8 pb-7 pt-8">

            {/* Logo */}
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M3 8l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Sign in to manage your email campaigns.
            </p>

          </div>

          {/* Form */}
          <div className="px-8 py-8">

            <form onSubmit={handlesubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                  required
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3">

                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v4m0 4h.01M10.29 3.86l-8.82 15A2 2 0 003.2 22h17.6a2 2 0 001.73-3.14l-8.82-15a2 2 0 00-3.42 0z"
                    />
                  </svg>

                  <p className="text-sm text-red-700">
                    {error}
                  </p>

                </div>
              )}

              {/* Options */}
              <div className="flex items-center justify-between">

                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900"
                  />

                  <span className="text-sm text-gray-600">
                    Remember me
                  </span>
                </label>

                <button
                  type="button"
                  className="text-sm font-medium text-gray-700 transition hover:text-gray-900"
                >
                  Forgot password?
                </button>

              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {status ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>

                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in

                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.8}
                        d="M13 5l7 7-7 7M20 12H4"
                      />
                    </svg>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 bg-gray-50 px-8 py-5 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?
              <button
                type="button"
                className="ml-1 font-medium text-gray-900 hover:underline"
              >
                Contact Administrator
              </button>
            </p>
          </div>

        </div>

        {/* Security */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">

          <svg
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M12 3l7 4v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V7l7-4z"
            />
          </svg>

          <span>
            Secure and encrypted connection
          </span>

        </div>

      </div>
    </section>
  );
};

export default Login;