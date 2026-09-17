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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8">

      {/* =====================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Indigo glow */}

        <div className="absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[120px]" />

        {/* Purple glow */}

        <div className="absolute bottom-[-180px] right-[-100px] h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px]" />

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

      </div>


      {/* =====================================================
          LOGIN CONTAINER
      ====================================================== */}

      <div className="relative z-10 w-full max-w-md">

        {/* =================================================
            BRAND
        ================================================== */}

        <div className="mb-7 text-center">

          {/* Logo */}

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 text-white shadow-xl shadow-indigo-500/20">

            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.7}
                d="M3 8l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
              />
            </svg>

          </div>

          <h1 className="text-xl font-bold tracking-tight text-white">
            Post a Letter
          </h1>

          <p className="mt-1 text-xs font-medium text-slate-500">
            Campaign Studio
          </p>

        </div>


        {/* =================================================
            LOGIN CARD
        ================================================== */}

        <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/40">

          {/* =================================================
              CARD HEADER
          ================================================== */}

          <div className="border-b border-slate-800 px-7 pb-7 pt-7 sm:px-8">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5">

              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shadow-lg shadow-indigo-400/50" />

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-300">
                Secure Login
              </span>

            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white">
              Welcome back
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Sign in to manage your email campaigns.
            </p>

          </div>


          {/* =================================================
              FORM
          ================================================== */}

          <div className="px-7 py-7 sm:px-8">

            <form
              onSubmit={handlesubmit}
              className="space-y-5"
            >

              {/* =================================================
                  EMAIL
              ================================================== */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Email address
                </label>

                <div className="relative">

                  <div className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 items-center text-slate-600">

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
                        d="M3 8l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                      />
                    </svg>

                  </div>

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setemail(e.target.value)
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 hover:border-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    required
                  />

                </div>

              </div>


              {/* =================================================
                  PASSWORD
              ================================================== */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Password
                </label>

                <div className="relative">

                  <div className="pointer-events-none absolute left-3.5 top-1/2 flex -translate-y-1/2 items-center text-slate-600">

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
                        d="M7 10V8a5 5 0 0110 0v2M6 10h12a2 2 0 012 2v7a2 2 0 01-2 2H6a2 2 0 01-2-2v-7a2 2 0 012-2z"
                      />
                    </svg>

                  </div>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setpassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 hover:border-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    required
                  />

                </div>

              </div>


              {/* =================================================
                  ERROR
              ================================================== */}

              {error && (

                <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">

                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10">

                    <svg
                      className="h-3.5 w-3.5 text-red-400"
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

                  </div>

                  <p className="text-sm leading-5 text-red-300">
                    {error}
                  </p>

                </div>

              )}


              {/* =================================================
                  OPTIONS
              ================================================== */}

              <div className="flex items-center justify-between">

                <label className="flex cursor-pointer items-center gap-2">

                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />

                  <span className="text-xs font-medium text-slate-500">
                    Remember me
                  </span>

                </label>


                <button
                  type="button"
                  className="text-xs font-semibold text-indigo-400 transition hover:text-indigo-300"
                >
                  Forgot password?
                </button>

              </div>


              {/* =================================================
                  SUBMIT
              ================================================== */}

              <button
                type="submit"
                disabled={status}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/30 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
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
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
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


          {/* =================================================
              FOOTER
          ================================================== */}

          <div className="border-t border-slate-800 bg-slate-950/50 px-7 py-5 text-center sm:px-8">

            <p className="text-xs text-slate-500">

              Don't have an account?

              <button
                type="button"
                className="ml-1 font-semibold text-indigo-400 transition hover:text-indigo-300 hover:underline"
              >
                Contact Administrator
              </button>

            </p>

          </div>

        </div>


        {/* =================================================
            SECURITY
        ================================================== */}

        <div className="mt-6 flex items-center justify-center gap-2">

          <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-emerald-500/10 bg-emerald-500/5">

            <svg
              className="h-3.5 w-3.5 text-emerald-400"
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

          </div>

          <span className="text-[11px] font-medium text-slate-600">
            Secure and encrypted connection
          </span>

        </div>

      </div>

    </section>
  );
};

export default Login;