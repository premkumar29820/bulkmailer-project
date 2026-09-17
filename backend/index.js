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

// app.post("/sendmail", authMiddleware, async (req, res) => {   //sendmail is protected route first run authmiddleware if its correct then execute mail sending code
//   const { subject, body, recipients } = req.body;

//   if (
//     !subject ||
//     !body ||
//     !Array.isArray(recipients) ||
//     recipients.length === 0
//   ) {
//     return res.status(400).json({
//       success: false,
//       message: "Subject, body and recipients are required"
//     })
//   }

//   try {
//     await connectDB()
//     await transporter.sendMail({   //send mail by nodemailer
//       from: process.env.EMAIL_USER,
//       to: recipients,
//       subject: subject,
//       text: body
//     })

//     await Email.create({   //if mail send successfully it will store in mongodb
//       subject: subject,
//       body: body,
//       recipients: recipients,
//       status: "success"   //sentAt time automatically create by mongodb
//     })

//     res.json({
//       success: true,
//       message: "Mail sent successfully"   //success msg for frontend
//     })
//   } catch (error) {
//     console.log("Email sending error:", error);

//     try {
//       await Email.create({
//         subject: subject,
//         body: body,
//         recipients: recipients,
//         status: "failed"   //try to save failed mail attempt in mongodb
//       });
//     } catch (dbError) {   //server error for frontend
//       console.log("Database save error:", dbError);
//     }

//     res.status(500).json({
//       success: false,
//       message: "Failed to send mail"    //for frontend alert
//     })
//   }
// })
app.post("/sendmail", authMiddleware, async (req, res) => {   //sendmail is protected route first run authmiddleware if its correct then execute mail sending code 
  const { subject, body, recipients } = req.body; 
 
  if ( 
    !subject || 
    !body || 
    !Array.isArray(recipients) || 
    recipients.length === 0 
  ) { 
    return res.status(400).json({ 
      success: false, 
      message: "Subject, body and recipients are required" 
    }) 
  } 
 
  try { 
    await connectDB() 
    await transporter.sendMail({   //send mail by nodemailer 
      from: process.env.EMAIL_USER, 
      to: recipients, 
      subject: subject, 
      text: body 
    }) 
 
    await Email.create({   //if mail send successfully it will store in mongodb 
      subject: subject, 
      body: body, 
      recipients: recipients, 
      status: "success"   //sentAt time automatically create by mongodb 
    }) 
 
    return res.status(200).json({ 
      success: true, 
      message: "Mail sent successfully"   //success msg for frontend 
    }) 
  } catch (error) { 
    console.log("Email sending error:", error); 

    return res.status(500).json({ 
      success: false, 
      message: "Failed to send mail"    //for frontend alert 
    }) 
  } 
})

app.get("/emails", authMiddleware, async (req, res) => {   //history fetch api
    
    try {
    await connectDB()
    const emails = await Email.find().sort({   //fetch all mail records in mongodb
      sentAt: -1    //means latest mail-> old mail
    })

    res.json({
      success: true,
      emails: emails     //history sent to frontend
    });
  } catch (error) {
    console.log("History fetch error:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch email history"
    });
  }
});

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected successfully");

//     app.listen(process.env.PORT || 3000, () => {
//       console.log(
//         `Server running on port ${process.env.PORT || 3000}`
//       );
//     });
//   })
//   .catch((error) => {
//     console.log("MongoDB connection failed")
//     console.log(error)
//   });

// if (require.main === module) {
//   app.listen(process.env.PORT || 3000, () => {
//     console.log(
//       `Server running on port ${process.env.PORT || 3000}`
//     );
//   });
// }

module.exports = app;
