import { useContext, useState } from "react";
import { Mailcontext } from "../context/Provider";
import * as XLSX from "xlsx";
import axios from "axios";

const Mailpage = () => {
  const { maildata, handlechange, setmaildata } =
    useContext(Mailcontext);

  const [status, setstatus] = useState(false);

  // Delivery report
  const [successCount, setsuccessCount] = useState(0);
  const [failedCount, setfailedCount] = useState(0);

  // Recipients
  const [recipientsText, setRecipientsText] = useState("");

  // Uploaded file name
  const [selectedFileName, setSelectedFileName] = useState("");

  // --------------------------------------------------
  // RECIPIENT LIST
  // --------------------------------------------------

  const recipients = recipientsText
    .split(/[,\n]/)
    .map((email) => email.trim())
    .filter((email) => email.length > 0);

  // Remove duplicate emails
  const uniqueRecipients = [...new Set(recipients)];

  // --------------------------------------------------
  // FIELD CHANGE
  // --------------------------------------------------

  const handleFieldChange = (e) => {
    handlechange(e);
  };

  // --------------------------------------------------
  // RECIPIENT CHANGE
  // --------------------------------------------------

  const handleRecipientsChange = (value) => {
    setRecipientsText(value);

    // Reset previous delivery report
    setsuccessCount(0);
    setfailedCount(0);
  };

  // --------------------------------------------------
  // EXCEL FILE
  // Column A = Email
  // --------------------------------------------------

  function handleFile(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setSelectedFileName(file.name);

    // Reset previous delivery report
    setsuccessCount(0);
    setfailedCount(0);

    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      try {
        const workbook = XLSX.read(
          loadEvent.target.result,
          {
            type: "array",
          }
        );

        const firstSheet =
          workbook.Sheets[
            workbook.SheetNames[0]
          ];

        const rows = XLSX.utils.sheet_to_json(
          firstSheet,
          {
            header: "A",
            defval: "",
          }
        );

        const emails = rows
          .map((row) =>
            String(row.A || "")
              .trim()
              .toLowerCase()
          )
          .filter(
            (email) => email.length > 0
          );

        if (emails.length === 0) {
          alert(
            "No email addresses found in column A."
          );

          setSelectedFileName("");
          return;
        }

        // Add Excel emails to existing recipients
        setRecipientsText(
          (currentText) =>
            [
              currentText,
              ...emails,
            ]
              .filter(Boolean)
              .join("\n")
        );
      } catch (error) {
        console.log(
          "Excel error:",
          error
        );

        alert(
          "Unable to read the Excel file."
        );

        setSelectedFileName("");
      }
    };

    reader.readAsArrayBuffer(file);
  }

  // --------------------------------------------------
  // SEND MAIL
  // --------------------------------------------------

  const handlesubmit = async (e) => {
    e.preventDefault();

    // Reset old report
    setsuccessCount(0);
    setfailedCount(0);

    // Subject validation
    if (!maildata?.subject?.trim()) {
      alert("Please enter email subject.");
      return;
    }

    // Message validation
    if (!maildata?.body?.trim()) {
      alert("Please enter email message.");
      return;
    }

    // Recipient validation
    if (uniqueRecipients.length === 0) {
      alert(
        "Please enter an email or upload an Excel file."
      );
      return;
    }

    const token =
      localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    try {
      setstatus(true);

      console.log(
        "Sending recipients:",
        uniqueRecipients
      );

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/sendmail`,
        {
          subject: maildata.subject,
          body: maildata.body,
          recipients: uniqueRecipients,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Backend response:",
        response.data
      );

      // ------------------------------------------------
      // GET ACTUAL COUNTS FROM BACKEND
      // ------------------------------------------------

      let successful = 0;
      let failed = 0;

      if (
        Array.isArray(
          response.data?.successfulEmails
        )
      ) {
        successful =
          response.data.successfulEmails.length;
      }

      if (
        Array.isArray(
          response.data?.failedEmails
        )
      ) {
        failed =
          response.data.failedEmails.length;
      }

      // If backend sends counts
      if (
        typeof response.data?.successCount ===
        "number"
      ) {
        successful =
          response.data.successCount;
      }

      if (
        typeof response.data?.failedCount ===
        "number"
      ) {
        failed =
          response.data.failedCount;
      }

      // ------------------------------------------------
      // SUCCESS RESPONSE
      // ------------------------------------------------

      if (response.data?.success) {
        // If backend only returns success=true,
        // assume all recipients succeeded.
        if (
          successful === 0 &&
          failed === 0
        ) {
          successful =
            uniqueRecipients.length;
        }

        setsuccessCount(successful);
        setfailedCount(failed);

        if (failed > 0) {
          alert(
            `Mail sending completed.\n\nSuccessful: ${successful}\nFailed: ${failed}`
          );
        } else {
          alert(
            `Mail sent successfully to ${successful} recipient${
              successful === 1
                ? ""
                : "s"
            }.`
          );
        }

        // Reset compose form
        setmaildata((prev) => ({
          ...prev,
          subject: "",
          body: "",
          recipients: "",
          file: null,
          filemails: [],
        }));

        setRecipientsText("");
        setSelectedFileName("");
      }

      // ------------------------------------------------
      // BACKEND FAILURE
      // ------------------------------------------------

      else {
        setsuccessCount(0);
        setfailedCount(
          uniqueRecipients.length
        );

        alert(
          response.data?.message ||
            "Mail could not be sent."
        );
      }
    } catch (error) {
      console.log(
        "Email sending error:",
        error
      );

      // Complete failure
      setsuccessCount(0);
      setfailedCount(
        uniqueRecipients.length
      );

      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to send mail"
      );
    } finally {
      setstatus(false);
    }
  };

  // --------------------------------------------------
  // REMOVE FILE
  // --------------------------------------------------

  const removeFile = () => {
    setSelectedFileName("");

    // Excel emails are merged into the textarea,
    // so existing recipients remain editable there.
  };

  // --------------------------------------------------
  // CLEAR COMPOSE
  // --------------------------------------------------

  const clearCompose = () => {
    setmaildata((prev) => ({
      ...prev,
      subject: "",
      body: "",
      recipients: "",
      file: null,
      filemails: [],
    }));

    setRecipientsText("");
    setSelectedFileName("");

    setsuccessCount(0);
    setfailedCount(0);
  };

  return (
    <section className="min-h-screen bg-slate-950 px-4 py-8 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div className="mb-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

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
                      strokeWidth={1.8}
                      d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L8 18l-4 1 1-4L16.5 3.5z"
                    />
                  </svg>

                </span>

                <span className="text-xs font-semibold text-indigo-300">
                  Campaign Studio
                </span>

              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Compose Email
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Create and send an email campaign to multiple
                recipients.
              </p>

            </div>


            {/* RECIPIENT COUNT */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-3 shadow-xl">

              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Recipients
              </p>

              <p className="mt-1 text-xl font-bold text-white">
                {uniqueRecipients.length}
              </p>

            </div>

          </div>

        </div>


        {/* ==================================================
            MAIN CONTENT
        ================================================== */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* ==================================================
              COMPOSE FORM
          ================================================== */}

          <div className="lg:col-span-2">

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

              {/* CARD HEADER */}

              <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">

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

                    <h3 className="text-sm font-semibold text-white">
                      Email Details
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Enter the message and recipients for your
                      campaign.
                    </p>

                  </div>

                </div>

              </div>


              {/* FORM */}

              <div className="p-6">

                <form
                  onSubmit={handlesubmit}
                  className="space-y-6"
                >

                  {/* ==================================================
                      SUBJECT
                  ================================================== */}

                  <div>

                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Subject
                    </label>

                    <input
                      type="text"
                      name="subject"
                      value={
                        maildata?.subject || ""
                      }
                      onChange={handleFieldChange}
                      placeholder="Enter email subject"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-600 hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                    />

                  </div>


                  {/* ==================================================
                      MESSAGE
                  ================================================== */}

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <label className="block text-sm font-medium text-slate-300">
                        Message
                      </label>

                      <span className="text-xs text-slate-600">
                        Email content
                      </span>

                    </div>

                    <textarea
                      name="body"
                      value={
                        maildata?.body || ""
                      }
                      onChange={handleFieldChange}
                      placeholder="Write your email message here..."
                      rows="7"
                      className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none transition-all placeholder:text-slate-600 hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                    />

                  </div>


                  {/* ==================================================
                      RECIPIENTS
                  ================================================== */}

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <label className="block text-sm font-medium text-slate-300">
                        Recipients
                      </label>

                      <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[10px] font-semibold text-indigo-400">
                        {uniqueRecipients.length} detected
                      </span>

                    </div>

                    <textarea
                      value={recipientsText}
                      onChange={(e) =>
                        handleRecipientsChange(
                          e.target.value
                        )
                      }
                      rows={5}
                      className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-mono leading-6 text-white outline-none transition-all placeholder:text-slate-600 hover:border-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                      placeholder={
                        "alice@example.com\nbob@example.com"
                      }
                    />


                    {/* ==================================================
                        UPLOAD EXCEL
                    ================================================== */}

                    <div className="mt-3 flex flex-wrap items-center gap-3">

                      <label className="group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-300">

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
                            d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                          />
                        </svg>

                        Upload Excel

                        <input
                          type="file"
                          accept=".csv,.xls,.xlsx"
                          onChange={handleFile}
                          className="sr-only"
                        />

                      </label>


                      {/* SELECTED FILE */}

                      {selectedFileName && (

                        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">

                          <svg
                            className="h-4 w-4 text-emerald-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.8}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>

                          <span className="max-w-[180px] truncate text-xs text-emerald-400">
                            {selectedFileName}
                          </span>

                          <button
                            type="button"
                            onClick={removeFile}
                            className="ml-1 text-xs font-semibold text-red-400 transition hover:text-red-300"
                          >
                            Remove
                          </button>

                        </div>

                      )}

                    </div>


                    <p className="mt-3 text-xs text-slate-600">

                      {uniqueRecipients.length} recipient
                      {uniqueRecipients.length === 1
                        ? ""
                        : "s"}{" "}
                      detected

                      <span className="text-slate-700">
                        {" "}
                        · one per line or comma-separated
                      </span>

                    </p>

                  </div>


                  {/* ==================================================
                      BUTTONS
                  ================================================== */}

                  <div className="flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row">

                    {/* CLEAR */}

                    <button
                      type="button"
                      onClick={clearCompose}
                      disabled={status}
                      className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-slate-400 transition-all hover:border-slate-600 hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-1/3"
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
                          d="M3 6h18M8 6V4h8v2m-9 0v14a2 2 0 002 2h6a2 2 0 002-2V6M10 11v6M14 11v6"
                        />
                      </svg>

                      Clear

                    </button>


                    {/* SEND */}

                    <button
                      type="submit"
                      disabled={status}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:from-indigo-400 hover:to-purple-500 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50"
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

                          Sending email...

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
                              d="M22 2L11 13M22 2l-7 20-4-9-9-7z"
                            />
                          </svg>

                          Send Email

                        </>

                      )}

                    </button>

                  </div>

                </form>

              </div>

            </div>

          </div>


          {/* ==================================================
              SIDEBAR - DELIVERY REPORT ONLY
          ================================================== */}

          <div>

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">

              {/* REPORT HEADER */}

              <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-4">

                <div className="flex items-center justify-between">

                  <div>

                    <h3 className="text-sm font-semibold text-white">
                      Delivery Report
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Current campaign
                    </p>

                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">

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
                        d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                      />
                    </svg>

                  </div>

                </div>

              </div>


              {/* REPORT CONTENT */}

              <div className="space-y-3 p-5">

                {/* SUCCESS */}

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">

                        <svg
                          className="h-4 w-4 text-emerald-400"
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

                      <span className="text-sm font-medium text-slate-300">
                        Successful
                      </span>

                    </div>

                    <span className="text-2xl font-bold text-emerald-400">
                      {successCount}
                    </span>

                  </div>

                </div>


                {/* FAILED */}

                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">

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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>

                      </div>

                      <span className="text-sm font-medium text-slate-300">
                        Failed
                      </span>

                    </div>

                    <span className="text-2xl font-bold text-red-400">
                      {failedCount}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
};

export default Mailpage;