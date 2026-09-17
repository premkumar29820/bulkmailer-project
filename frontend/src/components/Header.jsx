import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950 shadow-lg shadow-slate-950/20">
      <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            LOGO / BRAND
        ====================================================== */}

        <button
          onClick={() => navigate("/send-mail")}
          className="group flex items-center gap-3"
        >
          {/* Logo */}

          <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/40">

            <svg
              className="relative z-10 h-5 w-5"
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

            <div className="absolute -right-3 -top-3 h-8 w-8 rounded-full bg-white/10" />

          </div>

          {/* Brand */}

          <div className="hidden text-left sm:block">

            <h1 className="text-[15px] font-bold tracking-tight text-white">
              Post a Letter
            </h1>

            <p className="mt-0.5 text-[11px] font-medium text-slate-400">
              Campaign Studio
            </p>

          </div>
        </button>


        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <div className="flex items-center gap-2 sm:gap-4">

          {/* =================================================
              NAVIGATION
          ================================================== */}

          <nav className="flex items-center rounded-xl border border-slate-800 bg-slate-900 p-1 shadow-inner">

            {/* Compose */}

            <button
              onClick={() => navigate("/send-mail")}
              className="group flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white sm:px-4 sm:text-sm"
            >

              <svg
                className="h-4 w-4 text-slate-500 transition-colors group-hover:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.8}
                  d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L8 18l-4 1 1-4L16.5 3.5z"
                />
              </svg>

              <span>Compose</span>

            </button>


            {/* History */}

            <button
              onClick={() => navigate("/history")}
              className="group flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-400 transition-all duration-200 hover:bg-slate-800 hover:text-white sm:px-4 sm:text-sm"
            >

              <svg
                className="h-4 w-4 text-slate-500 transition-colors group-hover:text-indigo-400"
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

              <span>History</span>

            </button>

          </nav>


          {/* =================================================
              DIVIDER
          ================================================== */}

          <div className="hidden h-8 w-px bg-slate-800 sm:block" />


          {/* =================================================
              PROFILE
          ================================================== */}

          <div className="relative">

            <button
              onClick={() =>
                setShowDropdown(!showDropdown)
              }
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-4 ${
                showDropdown
                  ? "border-indigo-400 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 focus:ring-indigo-500/20"
                  : "border-slate-700 bg-slate-800 text-slate-200 hover:border-indigo-500 hover:bg-slate-700 focus:ring-slate-700"
              }`}
              aria-label="Open profile menu"
            >
              U
            </button>


            {/* =================================================
                DROPDOWN
            ================================================== */}

            {showDropdown && (
              <>

                {/* Click Outside */}

                <button
                  aria-label="Close menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() =>
                    setShowDropdown(false)
                  }
                />


                {/* Dropdown */}

                <div className="absolute right-0 z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/40">

                  {/* =================================================
                      USER INFORMATION
                  ================================================== */}

                  <div className="border-b border-slate-800 bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-5">

                    <div className="flex items-center gap-3">

                      {/* Avatar */}

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/20">
                        U
                      </div>


                      {/* Details */}

                      <div className="min-w-0">

                        <p className="text-sm font-bold text-white">
                          User
                        </p>

                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          user@gmail.com
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* =================================================
                      MENU
                  ================================================== */}

                  <div className="p-2">

                    {/* Logout */}

                    <button
                      onClick={handleLogout}
                      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                    >

                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 transition-colors group-hover:bg-red-500/10">

                        <svg
                          className="h-4 w-4 text-slate-500 transition-colors group-hover:text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.8}
                            d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
                          />
                        </svg>

                      </div>

                      <span>Sign out</span>

                    </button>

                  </div>

                </div>
              </>
            )}

          </div>

        </div>

      </div>
    </header>
  );
};

export default Header;