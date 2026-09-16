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
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo / Brand */}
        <button
          onClick={() => navigate("/send-mail")}
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
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

          <div className="hidden text-left sm:block">
            <h1 className="text-sm font-semibold tracking-tight text-gray-900">
              Post a Letter
            </h1>

            <p className="text-[11px] text-gray-500">
              Campaign Studio
            </p>
          </div>
        </button>

        {/* Navigation + Profile */}
        <div className="flex items-center gap-2 sm:gap-5">

          {/* Navigation */}
          <nav className="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1">
            <button
              onClick={() => navigate("/send-mail")}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-white hover:text-gray-900 hover:shadow-sm"
            >
              Compose
            </button>

            <button
              onClick={() => navigate("/history")}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-white hover:text-gray-900 hover:shadow-sm"
            >
              History
            </button>
          </nav>

          {/* Divider */}
          <div className="hidden h-7 w-px bg-gray-200 sm:block" />

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
              aria-label="Open profile menu"
            >
              U
            </button>

            {/* Dropdown */}
            {showDropdown && (
              <>
                {/* Click outside */}
                <button
                  aria-label="Close menu"
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setShowDropdown(false)}
                />

                <div className="absolute right-0 z-50 mt-3 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">

                  {/* User Info */}
                  <div className="border-b border-gray-100 px-4 py-4">
                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                        U
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          User
                        </p>

                        <p className="truncate text-xs text-gray-500">
                          user@gmail.com
                        </p>
                      </div>

                    </div>
                  </div>

                  {/* Logout */}
                  <div className="p-1.5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
                    >
                      <svg
                        className="h-4 w-4 text-gray-500"
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

                      Sign out
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