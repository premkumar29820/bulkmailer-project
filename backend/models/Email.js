const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },

    body: {
      type: String,
      required: true,
    },

    recipients: {
      type: [String],
      default: [],
    },

    successfulEmails: {
      type: [String],
      default: [],
    },

    failedEmails: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["Success", "Failed", "Partial"],
      default: "Failed",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Email",
  emailSchema
);