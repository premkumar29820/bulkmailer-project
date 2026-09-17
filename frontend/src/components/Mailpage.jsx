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

  // Recipients are maintained here
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

    // New campaign -> reset previous delivery report
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

    // New campaign -> reset previous report
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

    // Reset old report when sending new campaign
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

        // ------------------------------------------------
        // RESET COMPOSE FORM
        // ------------------------------------------------
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

      // Complete failure:
      // all recipients failed
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
  // REMOVE EXCEL / RECIPIENT FILE
  // --------------------------------------------------
  const removeFile = () => {
    setSelectedFileName("");

    // Remove all recipients loaded from file.
    // Since the Excel emails are merged into the
    // textarea, the user can also manually edit them.
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
    <section className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            
             <div>
              <h2 className="font-display text-4xl sm:text-5xl text-gray-900">
                Compose Email
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Create and send an email campaign to multiple recipients.
              </p>
            </div>

          </div>
        </div>

        {/* MAIN */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ==================================================
              FORM
          ================================================== */}
          <div className="lg:col-span-2">

            <div className="rounded-xl border border-gray-200 bg-white">

              <div className="border-b border-gray-100 px-6 py-5">
                <h3 className="text-sm font-semibold text-gray-900">
                  Email Details
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Enter the message and recipients for your campaign.
                </p>
              </div>

              <div className="p-6">

                <form
                  onSubmit={handlesubmit}
                  className="space-y-6"
                >

                  {/* SUBJECT */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
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
                      className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>

                  {/* MESSAGE */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">

                      <label className="block text-sm font-medium text-gray-700">
                        Message
                      </label>

                      <span className="text-xs text-gray-400">
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
                      className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                    />
                  </div>

                  {/* RECIPIENTS */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Recipients
                    </label>

                    <textarea
                      value={recipientsText}
                      onChange={(e) =>
                        handleRecipientsChange(
                          e.target.value
                        )
                      }
                      rows={4}
                      className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3.5 py-3 text-sm font-mono leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                      placeholder={
                        "alice@example.com\nbob@example.com"
                      }
                    />

                    <div className="mt-3 flex flex-wrap items-center gap-3">

                      <label className="inline-flex cursor-pointer items-center rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-slate-500 hover:text-slate-900">

                        Upload File

                        <input
                          type="file"
                          accept=".csv,.xls,.xlsx"
                          onChange={handleFile}
                          className="sr-only"
                        />

                      </label>

                      {selectedFileName && (
                        <div className="flex items-center gap-2">

                          <span className="text-xs text-gray-500">
                            {selectedFileName} added
                          </span>

                          <button
                            type="button"
                            onClick={removeFile}
                            className="text-xs font-medium text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>

                        </div>
                      )}

                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      {uniqueRecipients.length} recipient
                      {uniqueRecipients.length === 1
                        ? ""
                        : "s"}{" "}
                      detected
                      <span className="text-gray-300">
                        {" "}
                        · one per line or comma-separated
                      </span>
                    </p>
                  </div>

                  {/* SEND */}
                  <div className="border-t border-gray-100 pt-5">

                    <button
                      type="submit"
                      disabled={status}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
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
              SIDEBAR
          ================================================== */}
          <div className="space-y-4">

            {/* DELIVERY REPORT */}
            <div className="rounded-xl border border-gray-200 bg-white">

              <div className="border-b border-gray-100 px-5 py-4">

                <h3 className="text-sm font-semibold text-gray-900">
                  Delivery Report
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Current campaign
                </p>

              </div>

              <div className="space-y-3 p-5">

                {/* SUCCESS */}
                <div className="rounded-lg border border-gray-200 p-4">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50">

                        <svg
                          className="h-4 w-4 text-emerald-600"
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

                      <span className="text-sm font-medium text-gray-700">
                        Successful
                      </span>

                    </div>

                    <span className="text-2xl font-semibold text-gray-900">
                      {successCount}
                    </span>

                  </div>
                </div>

                {/* FAILED */}
                <div className="rounded-lg border border-gray-200 p-4">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50">

                        <svg
                          className="h-4 w-4 text-red-600"
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

                      <span className="text-sm font-medium text-gray-700">
                        Failed
                      </span>

                    </div>

                    <span className="text-2xl font-semibold text-gray-900">
                      {failedCount}
                    </span>

                  </div>
                </div>

              </div>
            </div>

            {/* CAMPAIGN SUMMARY */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">

              <h3 className="text-sm font-semibold text-gray-900">
                Campaign Summary
              </h3>

              <div className="mt-4 space-y-3">

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Recipients
                  </span>

                  <span className="text-sm font-medium text-gray-900">
                    {uniqueRecipients.length}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Subject
                  </span>

                  <span className="max-w-[180px] truncate text-sm font-medium text-gray-900">
                    {maildata?.subject || "-"}
                  </span>
                </div>

              </div>
            </div>

            {/* QUICK TIP */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">

              <p className="text-xs font-semibold text-gray-700">
                Quick tip
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                You can enter emails manually or upload an Excel file. Excel emails are read from column A.
              </p>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Mailpage;
