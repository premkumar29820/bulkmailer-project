// ======================================================
// LOAD ENVIRONMENT VARIABLES
// ======================================================

require("dotenv").config();


// ======================================================
// DNS CONFIGURATION
// ======================================================

const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
  "1.1.1.1",
]);


// ======================================================
// IMPORT PACKAGES
// ======================================================

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { AgentMailClient } = require("agentmail");
const jwt = require("jsonwebtoken");

const Email = require("./models/Email");


// ======================================================
// CREATE EXPRESS APP
// ======================================================

const app = express();


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());


// ======================================================
// AGENTMAIL CONFIGURATION
// ======================================================

const agentmail = new AgentMailClient({
  apiKey: process.env.AGENTMAIL_API_KEY,
});


// ======================================================
// MONGODB CONNECTION
// ======================================================

let isMongoConnected = false;

async function connectDB() {
  if (isMongoConnected && mongoose.connection.readyState === 1) {
    return;
  }

  await mongoose.connect(process.env.MONGO_URI);

  isMongoConnected = true;

  console.log("MongoDB connected successfully");
}


// ======================================================
// JWT AUTHENTICATION MIDDLEWARE
// ======================================================

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};


// ======================================================
// HOME / HEALTH CHECK
// ======================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Bulk Mail Backend Running",
  });
});


// ======================================================
// LOGIN
// ======================================================

app.post("/login", (req, res) => {

  try {

    const { email, password } = req.body;

    // Do NOT log passwords in production

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {

      const token = jwt.sign(
        {
          email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );

      return res.status(200).json({
        success: true,
        token,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });

  } catch (error) {

    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
});


// ======================================================
// SEND MAIL
// POST /sendmail
// ======================================================

app.post(
  "/sendmail",
  authMiddleware,
  async (req, res) => {

    try {

      await connectDB();

      const {
        subject,
        body,
        recipients,
      } = req.body;


      // --------------------------------------------------
      // VALIDATE SUBJECT
      // --------------------------------------------------

      if (!subject?.trim()) {

        return res.status(400).json({
          success: false,
          message: "Subject is required",
        });
      }


      // --------------------------------------------------
      // VALIDATE MESSAGE
      // --------------------------------------------------

      if (!body?.trim()) {

        return res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }


      // --------------------------------------------------
      // VALIDATE RECIPIENTS
      // --------------------------------------------------

      if (
        !Array.isArray(recipients) ||
        recipients.length === 0
      ) {

        return res.status(400).json({
          success: false,
          message: "Recipients are required",
        });
      }


      // --------------------------------------------------
      // REMOVE DUPLICATE EMAILS
      // --------------------------------------------------

      const uniqueRecipients = [
        ...new Set(
          recipients
            .map((email) => String(email).trim())
            .filter(Boolean)
        ),
      ];


      if (uniqueRecipients.length === 0) {

        return res.status(400).json({
          success: false,
          message: "No valid recipients found",
        });
      }


      // --------------------------------------------------
      // TRACK SUCCESS / FAILURE
      // --------------------------------------------------

      const successfulEmails = [];

      const failedEmails = [];


      // --------------------------------------------------
      // SEND EMAILS ONE BY ONE
      // --------------------------------------------------

      for (const email of uniqueRecipients) {

        try {

          // AgentMail API
          await agentmail.inboxes.messages.send(
            "prem-3287@agentmail.to",
            {
              to: email,
              subject: subject.trim(),
              text: body.trim(),
              html: `<p>${body.trim()}</p>`,
            }
          );


          successfulEmails.push(email);

          console.log(
            `Mail sent successfully to: ${email}`
          );

        } catch (error) {

          console.error(
            `Failed to send to ${email}:`,
            error.message
          );

          failedEmails.push(email);
        }
      }


      // --------------------------------------------------
      // DETERMINE CAMPAIGN STATUS
      // --------------------------------------------------

      let campaignStatus = "Failed";


      if (
        successfulEmails.length > 0 &&
        failedEmails.length === 0
      ) {

        campaignStatus = "Success";

      } else if (
        successfulEmails.length > 0 &&
        failedEmails.length > 0
      ) {

        campaignStatus = "Partial";
      }


      // --------------------------------------------------
      // SAVE EMAIL HISTORY
      // --------------------------------------------------

      const emailHistory = new Email({
        subject: subject.trim(),

        body: body.trim(),

        recipients: uniqueRecipients,

        successfulEmails,

        failedEmails,

        status: campaignStatus,
      });


      await emailHistory.save();


      // --------------------------------------------------
      // RESPONSE
      // --------------------------------------------------

      return res.status(200).json({

        success: true,

        message:
          failedEmails.length > 0
            ? "Mail sending completed with some failures"
            : "Mail sent successfully",

        successfulEmails,

        failedEmails,

        successCount:
          successfulEmails.length,

        failedCount:
          failedEmails.length,

        status: campaignStatus,
      });


    } catch (error) {

      console.error(
        "Send mail error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Failed to send mail",
      });
    }
  }
);


// ======================================================
// GET EMAIL HISTORY
// GET /emails
// ======================================================

app.get(
  "/emails",
  authMiddleware,
  async (req, res) => {

    try {

      await connectDB();

      const emails = await Email
        .find()
        .sort({
          createdAt: -1,
        });


      return res.status(200).json({
        success: true,
        emails,
      });


    } catch (error) {

      console.error(
        "Get email history error:",
        error
      );


      return res.status(500).json({
        success: false,
        message: "Failed to load email history",
      });
    }
  }
);


// ======================================================
// DELETE INDIVIDUAL EMAIL HISTORY
// DELETE /emails/:id
// ======================================================

app.delete(
  "/emails/:id",
  authMiddleware,
  async (req, res) => {

    try {

      await connectDB();

      const { id } = req.params;


      // --------------------------------------------------
      // CHECK MONGODB ID
      // --------------------------------------------------

      if (!mongoose.Types.ObjectId.isValid(id)) {

        return res.status(400).json({
          success: false,
          message: "Invalid email history ID",
        });
      }


      console.log(
        "Delete request received:",
        id
      );


      // --------------------------------------------------
      // DELETE RECORD
      // --------------------------------------------------

      const deletedEmail =
        await Email.findByIdAndDelete(id);


      // --------------------------------------------------
      // NOT FOUND
      // --------------------------------------------------

      if (!deletedEmail) {

        return res.status(404).json({
          success: false,
          message: "Email history not found",
        });
      }


      console.log(
        "Email history deleted:",
        deletedEmail._id
      );


      // --------------------------------------------------
      // SUCCESS
      // --------------------------------------------------

      return res.status(200).json({

        success: true,

        message:
          "Email history deleted successfully",

        id: deletedEmail._id,
      });


    } catch (error) {

      console.error(
        "Delete history error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to delete email history",
      });
    }
  }
);


// ======================================================
// GLOBAL ERROR HANDLER
// ======================================================

app.use(
  (err, req, res, next) => {

    console.error(
      "Unhandled error:",
      err
    );


    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);


// ======================================================
// START SERVER
// ======================================================

const PORT =
  process.env.PORT || 3000;


async function startServer() {

  try {

    await connectDB();


    app.listen(
      PORT,
      "0.0.0.0",
      () => {

        console.log(
          `Server running on port ${PORT}`
        );

      }
    );


  } catch (error) {

    console.error(
      "MongoDB connection failed:"
    );

    console.error(error);

    process.exit(1);
  }
}


startServer();