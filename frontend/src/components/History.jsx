import { useEffect, useState } from "react";
import axios from "axios";

const History = () => {
  const [emails, setemails] = useState([]);
  const [loading, setloading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [openId, setOpenId] = useState(null);

  // ============================================
  // FETCH EMAIL HISTORY
  // ============================================
  useEffect(() => {
    const fetchhistory = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No token found");
          setloading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/emails`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("History response:", response.data);

        setemails(response.data.emails || []);
      } catch (error) {
        console.error(
          "History error:",
          error.response?.data || error.message
        );
      } finally {
        setloading(false);
      }
    };

    fetchhistory();
  }, []);

  // ============================================
  // DELETE EMAIL HISTORY
  // ============================================
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

      console.log("Delete response:", response.data);

      if (response.data?.success) {
        setemails((prev) =>
          prev.filter(
            (email) => String(email._id) !== String(id)
          )
        );

        if (String(openId) === String(id)) {
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

  // ============================================
  // TOGGLE HISTORY
  // ============================================
  const toggleHistory = (id) => {
    setOpenId((currentId) =>
      String(currentId) === String(id)
        ? null
        : id
    );
  };

  // ============================================
  // LOADING SCREEN
  // ============================================
  if (loading) {
    return (
      <section className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-10">

        <div className="mx-auto max-w-6xl">

          <div className="mb-8">
            <div className="h-9 w-56 animate-pulse rounded-xl bg-slate-800" />

            <div className="mt-3 h-4 w-80 animate-pulse rounded-lg bg-slate-800" />
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">

            <div className="flex items-center justify-center gap-3 py-20">

              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-500" />

              <p className="text-sm font-medium text-slate-400">
                Loading email history...
              </p>

            </div>

          </div>

        </div>

      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-6xl">

        {/* ============================================
            PAGE HEADER
        ============================================ */}

        <div className="mb-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <div>

              {/* LABEL */}

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5">

                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white">

                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                    />
                  </svg>

                </span>

                <span className="text-xs font-semibold text-indigo-300">
                  Campaign Archive
                </span>

              </div>

              {/* TITLE */}

              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Email History
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Review your previous email campaigns,
                recipients, delivery results, and message
                content.
              </p>

            </div>


            {/* CAMPAIGN COUNT */}

            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 px-6 py-4 shadow-xl">

              <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-indigo-500/10 blur-xl" />

              <div className="relative">

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Total Campaigns
                </p>

                <div className="mt-1 flex items-center gap-2">

                  <p className="text-2xl font-bold text-white">
                    {emails.length}
                  </p>

                  <span className="text-xs text-indigo-400">
                    campaigns
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* ============================================
            EMPTY STATE
        ============================================ */}

        {emails.length === 0 ? (

          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">

            <div className="relative px-6 py-24 text-center">

              {/* Decorative glow */}

              <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/10 blur-3xl" />

              <div className="relative">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-indigo-500/20 bg-indigo-500/10">

                  <svg
                    className="h-8 w-8 text-indigo-400"
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

                <h3 className="mt-6 text-lg font-bold text-white">
                  No campaigns yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Once you send an email campaign, its
                  delivery history will automatically appear
                  here.
                </p>

              </div>

            </div>

          </div>

        ) : (

          /* ============================================
             HISTORY LIST
          ============================================ */

          <div className="space-y-4">

            {emails.map((email) => {

              const isOpen =
                String(openId) === String(email._id);

              const isDeleting =
                String(deletingId) === String(email._id);

              // ==========================================
              // NORMALIZE STATUS
              // ==========================================

              const status =
                String(email.status || "")
                  .trim()
                  .toLowerCase();

              const isSuccess =
                status === "success";

              const isPartial =
                status === "partial";

              const isFailed =
                status === "failed";

              let statusText = "Failed";

              if (isSuccess) {
                statusText = "Delivered";
              } else if (isPartial) {
                statusText = "Partial";
              } else if (isFailed) {
                statusText = "Failed";
              }

              return (

                <div
                  key={email._id}
                  className={`group overflow-hidden rounded-2xl border bg-slate-900 transition-all duration-300 ${
                    isOpen
                      ? "border-indigo-500/40 shadow-2xl shadow-indigo-950/40"
                      : "border-slate-800 shadow-lg shadow-black/10 hover:border-slate-700 hover:shadow-xl"
                  }`}
                >

                  {/* ========================================
                      CAMPAIGN HEADER
                  ======================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleHistory(email._id)
                    }
                    className="w-full px-5 py-5 text-left sm:px-6"
                  >

                    <div className="flex items-start gap-4">

                      {/* EMAIL ICON */}

                      <div
                        className={`hidden h-12 w-12 shrink-0 items-center justify-center rounded-xl border sm:flex ${
                          isSuccess
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : isPartial
                            ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                            : "border-red-500/20 bg-red-500/10 text-red-400"
                        }`}
                      >

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


                      {/* CAMPAIGN INFORMATION */}

                      <div className="min-w-0 flex-1">

                        <h2 className="truncate pr-3 text-base font-bold text-white sm:text-lg">
                          {email.subject || "No subject"}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500">

                          {/* DATE */}

                          <span className="inline-flex items-center gap-1.5">

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
                                d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>

                            {email.sentAt
                              ? new Date(
                                  email.sentAt
                                ).toLocaleString()
                              : email.createdAt
                              ? new Date(
                                  email.createdAt
                                ).toLocaleString()
                              : "Unknown date"}

                          </span>

                          <span className="hidden text-slate-700 sm:inline">
                            •
                          </span>

                          {/* RECIPIENT COUNT */}

                          <span className="inline-flex items-center gap-1.5">

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
                                d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm11 10v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
                              />
                            </svg>

                            {email.recipients?.length || 0}{" "}
                            recipients

                          </span>

                        </div>

                      </div>


                      {/* STATUS + ARROW */}

                      <div className="flex shrink-0 items-center gap-3">

                        {/* STATUS */}

                        <span
                          className={`hidden items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold sm:inline-flex ${
                            isSuccess
                              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                              : isPartial
                              ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                              : "border-red-500/20 bg-red-500/10 text-red-400"
                          }`}
                        >

                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isSuccess
                                ? "bg-emerald-400"
                                : isPartial
                                ? "bg-amber-400"
                                : "bg-red-400"
                            }`}
                          />

                          {statusText}

                        </span>


                        {/* ARROW */}

                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 ${
                            isOpen
                              ? "rotate-180 bg-indigo-500/10 text-indigo-400"
                              : "group-hover:bg-slate-800 group-hover:text-slate-300"
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
                              strokeWidth={2}
                              d="M6 9l6 6 6-6"
                            />
                          </svg>

                        </div>

                      </div>

                    </div>


                    {/* MOBILE STATUS */}

                    <div className="mt-4 flex sm:hidden">

                      <span
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                          isSuccess
                            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            : isPartial
                            ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                            : "border-red-500/20 bg-red-500/10 text-red-400"
                        }`}
                      >

                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isSuccess
                              ? "bg-emerald-400"
                              : isPartial
                              ? "bg-amber-400"
                              : "bg-red-400"
                          }`}
                        />

                        {statusText}

                      </span>

                    </div>

                  </button>


                  {/* ========================================
                      EXPANDED CONTENT
                  ======================================== */}

                  {isOpen && (

                    <div className="border-t border-slate-800">

                      <div className="bg-slate-950/60 p-4 sm:p-6">

                        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">

                          {/* ==================================
                              MESSAGE
                          ================================== */}

                          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">

                            <div className="mb-4 flex items-center justify-between">

                              <div>

                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-400">
                                  Message
                                </p>

                                <p className="mt-1 text-sm font-semibold text-white">
                                  Email content
                                </p>

                              </div>

                              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-800 text-indigo-400">

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
                                    d="M4 6h16M4 12h16M4 18h10"
                                  />
                                </svg>

                              </div>

                            </div>


                            <div className="min-h-[150px] rounded-xl border border-slate-800 bg-slate-950 p-4">

                              <p className="whitespace-pre-wrap text-sm leading-7 text-slate-400">
                                {email.body ||
                                  "No message content."}
                              </p>

                            </div>

                          </div>


                          {/* ==================================
                              RECIPIENTS
                          ================================== */}

                          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">

                            <div className="mb-4 flex items-center justify-between">

                              <div>

                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-400">
                                  Recipients
                                </p>

                                <p className="mt-1 text-sm font-semibold text-white">
                                  Delivery list
                                </p>

                              </div>

                              <span className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs font-bold text-slate-300">
                                {email.recipients?.length || 0}
                              </span>

                            </div>


                            <div className="max-h-[190px] min-h-[150px] overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-3">

                              {email.recipients?.length > 0 ? (

                                <div className="space-y-2">

                                  {email.recipients.map(
                                    (
                                      recipient,
                                      recipientIndex
                                    ) => (

                                      <div
                                        key={`${recipient}-${recipientIndex}`}
                                        className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2.5 transition-colors hover:border-indigo-500/30"
                                      >

                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400">

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
                                              d="M3 8l9 6 9-6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z"
                                            />
                                          </svg>

                                        </div>

                                        <span className="min-w-0 truncate text-xs font-medium text-slate-400">
                                          {recipient}
                                        </span>

                                      </div>

                                    )
                                  )}

                                </div>

                              ) : (

                                <div className="flex min-h-[130px] items-center justify-center">

                                  <p className="text-sm text-slate-600">
                                    No recipients available.
                                  </p>

                                </div>

                              )}

                            </div>

                          </div>

                        </div>


                        {/* ==================================
                            CAMPAIGN STATISTICS
                        ================================== */}

                        <div className="mt-5 grid gap-3 sm:grid-cols-3">

                          {/* TOTAL */}

                          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-lg">

                            <div className="flex items-center justify-between">

                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                                Total
                              </p>

                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400">

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
                                    d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m0-8a4 4 0 110 8 4 4 0 010-8zm8 4a3 3 0 100-6 3 3 0 000 6z"
                                  />
                                </svg>

                              </div>

                            </div>

                            <p className="mt-3 text-2xl font-bold text-white">
                              {email.recipients?.length || 0}
                            </p>

                          </div>


                          {/* SUCCESSFUL */}

                          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-lg">

                            <div className="flex items-center justify-between">

                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">
                                Successful
                              </p>

                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">

                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>

                              </div>

                            </div>

                            <p className="mt-3 text-2xl font-bold text-emerald-400">
                              {email.successfulEmails?.length || 0}
                            </p>

                          </div>


                          {/* FAILED */}

                          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 shadow-lg">

                            <div className="flex items-center justify-between">

                              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-400">
                                Failed
                              </p>

                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400">

                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>

                              </div>

                            </div>

                            <p className="mt-3 text-2xl font-bold text-red-400">
                              {email.failedEmails?.length || 0}
                            </p>

                          </div>

                        </div>

                      </div>


                      {/* ========================================
                          FOOTER
                      ======================================== */}

                      <div className="flex flex-col gap-3 border-t border-slate-800 bg-slate-900 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                        {/* CAMPAIGN ID */}

                        <div className="flex min-w-0 items-center gap-2">

                          <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                            Campaign ID
                          </span>

                          <span className="max-w-[200px] truncate rounded-md border border-slate-800 bg-slate-950 px-2 py-1 font-mono text-[10px] text-slate-600">
                            {email._id}
                          </span>

                        </div>


                        {/* DELETE */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteEmail(
                              email._id
                            )
                          }
                          disabled={isDeleting}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-xs font-semibold text-red-400 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {isDeleting ? (

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

                              Clearing...

                            </>

                          ) : (

                            <>

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
                                  d="M6 7h12M10 11v6M14 11v6M8 7l1-3h6l1 3m-9 0v12a2 2 0 002 2h8a2 2 0 002-2V7"
                                />
                              </svg>

                              Clear History

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