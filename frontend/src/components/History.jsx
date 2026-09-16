import { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [emails, setemails] = useState([]);
  const [loading, setloading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [openId, setOpenId] = useState(null);

  // ---------------------------------------------
  // FETCH HISTORY
  // ---------------------------------------------
  useEffect(() => {
    const fetchhistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/emails`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setemails(response.data.emails || []);
      } catch (error) {
        console.log("History error:", error);
      }

      setloading(false);
    };

    fetchhistory();
  }, []);

  // ---------------------------------------------
  // DELETE INDIVIDUAL HISTORY
  // ---------------------------------------------
  const handleDeleteEmail = async (id) => {
  if (!id) {
    alert("Invalid email history ID");
    return;
  }

  const confirmed = window.confirm(
    "Are you sure you want to delete this email history?"
  );

  if (!confirmed) return;

  try {
    setDeletingId(id);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/emails/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(
      "Delete response:",
      response.data
    );

    if (response.data?.success) {
      // Remove only this history item
      setemails((prev) =>
        prev.filter(
          (email) =>
            String(email._id) !== String(id)
        )
      );

      // Close expanded item if deleted
      if (openId === id) {
        setOpenId(null);
      }
    } else {
      alert(
        response.data?.message ||
          "Failed to delete history"
      );
    }

  } catch (error) {
    console.error(
      "Delete history error:",
      error
    );

    alert(
      error.response?.data?.message ||
        "Failed to delete email history"
    );
  } finally {
    setDeletingId(null);
  }
};
  // ---------------------------------------------
  // TOGGLE DROPDOWN
  // ---------------------------------------------
  const toggleHistory = (id) => {
    setOpenId((currentId) =>
      currentId === id ? null : id
    );
  };

  // ---------------------------------------------
  // LOADING
  // ---------------------------------------------
  if (loading) {
    return (
      <section className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          <div className="mb-8">
            <div className="h-7 w-48 animate-pulse rounded-md bg-gray-200" />
            <div className="mt-3 h-4 w-72 animate-pulse rounded-md bg-gray-200" />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-3">

              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-slate-900" />

              <p className="text-sm text-gray-500">
                Loading email history...
              </p>

            </div>
          </div>

        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-5xl">

        {/* ============================================= */}
        {/* PAGE HEADER */}
        {/* ============================================= */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">

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

            <div>

              <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
                Email History
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Review and manage your previous email campaigns.
              </p>

            </div>

          </div>

        </div>


        {/* ============================================= */}
        {/* EMPTY STATE */}
        {/* ============================================= */}

        {emails.length === 0 ? (

          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">

              <svg
                className="h-6 w-6 text-gray-400"
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

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              No email history
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Once you send an email campaign, your delivery history
              will appear here.
            </p>

          </div>

        ) : (

          /* ============================================= */
          /* HISTORY DROPDOWN LIST */
          /* ============================================= */

          <div className="space-y-3">

            {emails.map((email, index) => {

              const isOpen = openId === email._id;
              const isDeleting = deletingId === email._id;

              return (

                <div
                  key={email._id}
                  className={`overflow-hidden rounded-xl border bg-white transition-all duration-200 ${
                    isOpen
                      ? "border-gray-300 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >

                  {/* ============================================= */}
                  {/* COLLAPSED HEADER */}
                  {/* ============================================= */}

                  <button
                    type="button"
                    onClick={() => toggleHistory(email._id)}
                    className="w-full px-4 py-4 text-left sm:px-5"
                  >

                    <div className="flex items-center gap-3">

                    

                      {/* SUBJECT */}

                      <div className="min-w-0 flex-1">

                        <h2 className="truncate text-sm font-semibold text-gray-900 sm:text-base">
                          {email.subject || "No subject"}
                        </h2>

                        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">

                          <span>
                            {email.sentAt
                              ? new Date(
                                  email.sentAt
                                ).toLocaleString()
                              : "Unknown date"}
                          </span>

                          <span className="text-gray-300">
                            •
                          </span>

                          <span>
                            {email.recipients?.length || 0} recipients
                          </span>

                        </div>

                      </div>


                      {/* STATUS */}

                      <span
                        className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium sm:inline-flex ${
                          email.status === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-red-200 bg-red-50 text-red-700"
                        }`}
                      >

                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            email.status === "success"
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        />

                        {email.status === "success"
                          ? "Delivered"
                          : "Failed"}

                      </span>


                      {/* ARROW */}

                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-gray-400 transition-transform duration-200 ${
                          isOpen
                            ? "rotate-180 bg-gray-100"
                            : "bg-transparent"
                        }`}
                      >

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
                            d="M6 9l6 6 6-6"
                          />
                        </svg>

                      </div>

                    </div>


                    {/* MOBILE STATUS */}

                    <div className="mt-3 flex sm:hidden">

                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                          email.status === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-red-200 bg-red-50 text-red-700"
                        }`}
                      >

                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            email.status === "success"
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        />

                        {email.status === "success"
                          ? "Delivered"
                          : "Failed"}

                      </span>

                    </div>

                  </button>


                  {/* ============================================= */}
                  {/* DROPDOWN CONTENT */}
                  {/* ============================================= */}

                  {isOpen && (

                    <div className="border-t border-gray-100">

                      <div className="grid gap-5 bg-gray-50/60 p-4 sm:p-5 lg:grid-cols-2">

                        {/* MESSAGE */}

                        <div>

                          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                            Message
                          </p>

                          <div className="min-h-[120px] rounded-xl border border-gray-200 bg-white p-4">

                            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                              {email.body || "No message content."}
                            </p>

                          </div>

                        </div>


                        {/* RECIPIENTS */}

                        <div>

                          <div className="mb-2 flex items-center justify-between">

                            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                              Recipients
                            </p>

                            <span className="text-xs text-gray-400">
                              {email.recipients?.length || 0} total
                            </span>

                          </div>

                          <div className="max-h-[160px] min-h-[120px] overflow-y-auto rounded-xl border border-gray-200 bg-white p-4">

                            {email.recipients?.length > 0 ? (

                              <div className="flex flex-wrap gap-2">

                                {email.recipients.map(
                                  (recipient, recipientIndex) => (

                                    <span
                                      key={`${recipient}-${recipientIndex}`}
                                      className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs text-gray-600"
                                    >
                                      {recipient}
                                    </span>

                                  )
                                )}

                              </div>

                            ) : (

                              <p className="text-sm text-gray-400">
                                No recipients available.
                              </p>

                            )}

                          </div>

                        </div>

                      </div>


                      {/* ============================================= */}
                      {/* DROPDOWN FOOTER */}
                      {/* ============================================= */}

                      <div className="flex flex-col gap-3 border-t border-gray-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">

                        <div className="flex items-center gap-2">

                          <span className="text-xs text-gray-400">
                            Campaign ID:
                          </span>

                          <span className="max-w-[180px] truncate font-mono text-[10px] text-gray-400">
                            {email._id}
                          </span>

                        </div>


                        {/* CLEAR BUTTON */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteEmail(email._id)
                          }
                          disabled={isDeleting}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {isDeleting ? (

                            <>
                              <svg
                                className="h-3.5 w-3.5 animate-spin"
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

                              Clearing...

                            </>

                          ) : (

                            <>

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
                                  d="M6 7h12M10 11v6M14 11v6M8 7l1-3h6l1 3m-9 0v12a2 2 0 002 2h8a2 2 0 002-2V7"
                                />
                              </svg>

                              Clear

                            </>

                          )}

                        </button>

                      </div>

                    </div>

                  )}

                </div>

              );
            })}

          </div>

        )}

      </div>

    </section>
  );
};

export default History;