 require("dotenv").config();   //load .env file variable into node.js apllication like use port mail,pass with process.env.PORT

const dns = require("dns");  //import dns module for resolve domain name to IP address
dns.setServers(["8.8.8.8","8.8.4.4", "1.1.1.1"]);   //for set google dns connection because sometime error in mongodb connection with dns

const express = require("express");
const cors = require("cors");   //it only allow the already required port 
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");   //jwt for login authentication jwt token create/verify

const Email = require("./models/Email");

const app = express();

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({  //create email sending configuration
  service: "gmail",   //use gmail service
  auth: {         //gmail authentication start
    user: process.env.EMAIL_USER,     //get user from env
    pass: process.env.EMAIL_PASS
  }
})

let isMongoConnected = false;

async function connectDB() {
  if (isMongoConnected) return;

  await mongoose.connect(process.env.MONGO_URI);

  isMongoConnected = true;

  console.log("MongoDB connected successfully");
}

const authMiddleware = (req, res, next) => { //its for proptected route security middleware it check user login or not   
  const authHeader = req.headers.authorization; //get authorization from frontend    like authorization:`bearer ${token}
  const token = authHeader?.split(" ")[1];   //split like Bearer abc123  [1]->abc123 its a jwt token

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized"
    });
  }

  try {
    const decoded = jwt.verify(   //try to verify that token
      token,
      process.env.JWT_SECRET  //this is in jwt create in env
    )

    req.user = decoded;   //store user information in req object
    next();   //if token valid it allow to next route eg:/sendmail
  } catch (error) {
    return res.status(401).json({   //for invalid
      success: false,
      message: "Invalid or expired token"
    });
  }
};

app.get("/", (req, res) => {   //home route this route executed in browser open
  res.json({
    success: true,
    message: "Bulk Mail Backend Running"
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log("Frontend mail:",email)
  console.log("frontend password:",password)
  console.log("ENV  emAil",process.env.ADMIN_EMAIL)
  console.log("Env password:",process.env.ADMIN_PASSWORD)

  if (
    email === process.env.ADMIN_EMAIL &&   //check the user login with mail & pass
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(   //create jwt token
      { email },   //first store mail
      process.env.JWT_SECRET,  //use jwt secret in env
      { expiresIn: "2h" }   //set time limit for token
    );

    return res.json({   //send token for frontend
      success: true,
      token
    });
  }

  res.status(401).json({   //if mail or pass is wrong it return 401 error
    success: false,
    message: "Invalid email or password"
  });
});


// })
app.post("/sendmail", authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const { subject, body, recipients } = req.body;

    if (!subject?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject is required",
      });
    }

    if (!body?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    if (
      !Array.isArray(recipients) ||
      recipients.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Recipients are required",
      });
    }

    const successfulEmails = [];
    const failedEmails = [];

    // Send one by one so we know exactly
    // which recipients succeeded/failed.
    for (const email of recipients) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: subject,
          text: body,
        });

        successfulEmails.push(email);
      } catch (error) {
        console.log(
          `Failed to send to ${email}:`,
          error.message
        );

        failedEmails.push(email);
      }
    }

    // ------------------------------------------------
    // HISTORY STATUS
    // ------------------------------------------------
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

    // ------------------------------------------------
    // SAVE HISTORY
    // IMPORTANT:
    // Save both successful AND failed campaigns
    // ------------------------------------------------
    const emailHistory = new Email({
      subject,
      body,
      recipients,
      successfulEmails,
      failedEmails,
      status: campaignStatus,
    });

    await emailHistory.save();

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
    console.log(
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
});


// DELETE INDIVIDUAL EMAIL HISTORY
app.delete("/emails/:id", authMiddleware, async (req, res) => {
  try {
    await connectDB();

    const { id } = req.params;

    const deletedEmail = await Email.findByIdAndDelete(id);

    if (!deletedEmail) {
      return res.status(404).json({
        success: false,
        message: "Email history not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email history deleted successfully",
    });

  } catch (error) {
    console.log("Delete history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete email history",
    });
  }
});


const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:");
    console.error(error);
  });


