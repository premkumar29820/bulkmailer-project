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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070b18] px-4 py-8 sm:px-6">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Top glow */}

        <div className="absolute left-1/2 top-[-250px] h-[550px] w-[550px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[150px]" />

        {/* Left glow */}

        <div className="absolute bottom-[-180px] left-[-180px] h-[450px] w-[450px] rounded-full bg-purple-600/10 blur-[130px]" />

        {/* Right glow */}

        <div className="absolute right-[-150px] top-[30%] h-[400px] w-[400px] rounded-full bg-blue-600/10 blur-[130px]" />

        {/* Grid */}

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />

      </div>


      {/* =====================================================
          LOGIN WRAPPER
      ====================================================== */}

      <div className="relative z-10 w-full max-w-[430px]">

        {/* =================================================
            BRAND
        ================================================== */}

        <div className="mb-8 text-center">

          {/* Logo */}

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 shadow-2xl shadow-indigo-500/20">

            <svg
              className="h-8 w-8 text-white"
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

          <h1 className="text-2xl font-bold tracking-tight text-white">
            Post a Letter
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Campaign Studio
          </p>

        </div>


        {/* =================================================
            LOGIN CARD
        ================================================== */}

        <div className="overflow-hidden rounded-3xl border border-white/[0.07] bg-slate-900/90 shadow-2xl shadow-black/50 backdrop-blur-xl">

          {/* =================================================
              CARD TOP
          ================================================== */}

          <div className="px-7 pb-7 pt-8 sm:px-9">

            {/* Secure Login */}

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.08] px-3 py-1.5">

              <span className="relative flex h-2 w-2">

                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-50" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-400" />

              </span>

              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-300">
                Secure Login
              </span>

            </div>


            <h2 className="text-2xl font-bold tracking-tight text-white">
              Welcome back
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Sign in to manage your email campaigns.
            </p>

          </div>


          {/* =================================================
              FORM
          ================================================== */}

          <div className="border-t border-slate-800/80 px-7 py-7 sm:px-9">

            <form
              onSubmit={handlesubmit}
              className="space-y-5"
            >

              {/* =================================================
                  EMAIL
              ================================================== */}

              <div>

                <label className="mb-2.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                  Email address
                </label>

                <div className="group relative">

                  <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-slate-600 transition-colors group-focus-within:text-indigo-400">

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
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:bg-slate-950 focus:ring-4 focus:ring-indigo-500/10"
                    required
                  />

                </div>

              </div>


              {/* =================================================
                  PASSWORD
              ================================================== */}

              <div>

                <label className="mb-2.5 block text-xs font-bold uppercase tracking-wide text-slate-400">
                  Password
                </label>

                <div className="group relative">

                  <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-slate-600 transition-colors group-focus-within:text-indigo-400">

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
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-950/80 py-3.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-700 hover:border-slate-600 focus:border-indigo-500 focus:bg-slate-950 focus:ring-4 focus:ring-indigo-500/10"
                    required
                  />

                </div>

              </div>


              {/* =================================================
                  ERROR
              ================================================== */}

              {error && (

                <div className="rounded-xl border border-red-500/20 bg-red-500/[0.07] p-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10">

                      <svg
                        className="h-4 w-4 text-red-400"
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

                    <div>

                      <p className="text-xs font-semibold text-red-300">
                        Login failed
                      </p>

                      <p className="mt-1 text-xs leading-5 text-red-400/80">
                        {error}
                      </p>

                    </div>

                  </div>

                </div>

              )}


              {/* =================================================
                  OPTIONS
              ================================================== */}

              <div className="flex items-center justify-between pt-1">

                <label className="flex cursor-pointer items-center gap-2.5">

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
                  className="text-xs font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  Forgot password?
                </button>

              </div>


              {/* =================================================
                  LOGIN BUTTON
              ================================================== */}

              <button
                type="submit"
                disabled={status}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 px-4 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-indigo-500/30 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >

                {/* Button shine */}

                {!status && (
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                )}


                {status ? (

                  <>

                    <svg
                      className="relative h-4 w-4 animate-spin"
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

                    <span className="relative">
                      Signing in...
                    </span>

                  </>

                ) : (

                  <>

                    <span className="relative">
                      Sign in
                    </span>

                    <svg
                      className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
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
              ADMINISTRATOR
          ================================================== */}

          <div className="border-t border-slate-800/80 bg-slate-950/40 px-7 py-5 text-center sm:px-9">

            <p className="text-xs text-slate-600">

              Don't have an account?

              <button
                type="button"
                className="ml-1.5 font-semibold text-indigo-400 transition-colors hover:text-indigo-300 hover:underline"
              >
                Contact Administrator
              </button>

            </p>

          </div>

        </div>


        {/* =================================================
            SECURITY FOOTER
        ================================================== */}

        <div className="mt-6 flex items-center justify-center gap-2">

          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/10 bg-emerald-500/5">

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