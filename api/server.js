const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const db = require("./config/database");
const app = express();
const port = 3000;

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/daftar", async (req, res) => {
  const { fullname, email, password, umur, role } = req.body;
  try {
    const post_data =
      await db.query(`INSERT INTO user(fullname, email, password, umur, role, email_verified_at) VALUES ("${fullname}", "${email}", "${password}", "${umur}", "${role}", null)`);

    if (post_data) {
      const logInsert = await db.query(
        `INSERT INTO logs(pesan, waktu) VALUES ("User baru terdaftar dengan ID ${post_data.insertId
        }", "${new Date().toISOString().slice(0, 19).replace("T", " ")}")`,
      );
    }

    res.status(200).json({
      msg: "Berhasil membuat user",
      user: post_data,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Gagal membuat user",
      err: error,
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const User = await db.query(
    `SELECT * FROM user WHERE email = '${email}' AND password = '${password}' `,
  );

  if (User.length === 1) {
    const login_log = await db.query(
      `INSERT INTO logs(pesan, waktu) VALUES ("User dengan ID ${User[0].id
      } telah login", "${new Date()
        .toISOString()
        .slice(0, 19)
        .replace("T", " ")}")`,
    );

    const token = jwt.sign(User[0], process.env.JWT_SECRET_KEY, {
      expiresIn: "3600s",
    });

    return res.json({
      msg: "Logged In",
      data: token,
    });
  }

  return res.status(401).json({
    msg: "User not Found",
  });
});

app.post("/verifytoken", async (req, res) => {
  const { token } = req.body;

  if (token) {
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const User = await db.query(
      `SELECT * FROM user WHERE id = '${data.id}'`,
    );

    const respond = User[0];
    respond.token = token;

    return res.json({
      data: respond,
    });
  }

  return res.json({
    msg: "Token invalid",
  });
});

app.post('/verify/:token', async (req, res) => {
  const { token } = req.body;

  if (token) {
    try {
      const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      today = yyyy + '-' + mm + '-' + dd;

      await db.query(
        `UPDATE user SET email_verified_at = '${today}' WHERE id = '${data.id}'`,
      );

      await db.query(
        `INSERT INTO logs(pesan, waktu) VALUES ("User dengan ID ${data.id
        } telah memverifikasi akunnya pada", "${new Date()
          .toISOString()
          .slice(0, 19)
          .replace("T", " ")}")`,
      );

      return res.json({
        msg: "Email Akun anda telah diverifikasi!",
      });
    } catch (error) {
      return res.status(400).json({
        msg: "Failed to verify email! </br> Token invalid",
      });
    }
  }

  return res.status(400).json({
    msg: "Failed to verify email! </br> Token invalid",
  });
});

app.post("/send/verify/email", async (req, res) => {
  try {
    const { email, token } = req.body;

    const User = await db.query(
      `SELECT * FROM user WHERE email = '${email}'`,
    );

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: "no-reply@explame.com",
      to: email,
      subject: "Email Verification",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background-color: #f9f9f9;
                  margin: 0;
                  padding: 0;
                  -webkit-font-smoothing: antialiased;
                  -webkit-text-size-adjust: none;
                  width: 100% !important;
              }
              .email-container {
                  width: 100%;
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
              }
              .email-header {
                  text-align: center;
                  padding: 20px;
                  background-color: #007bff;
                  color: #ffffff;
                  border-radius: 8px 8px 0 0;
              }
              .email-header h1 {
                  margin: 0;
                  font-size: 24px;
              }
              .email-body {
                  padding: 20px;
                  color: #333333;
              }
              .email-body p {
                  font-size: 16px;
                  line-height: 1.5;
              }
              .email-body a {
                  display: inline-block;
                  margin-top: 20px;
                  padding: 10px 20px;
                  background-color: #007bff;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 5px;
                  font-weight: bold;
              }
              .email-footer {
                  text-align: center;
                  padding: 20px;
                  font-size: 12px;
                  color: #888888;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="email-header">
                  <h1>Email Verification</h1>
              </div>
              <div class="email-body">
                  <p>Hello,</p>
                  <p>Thank you for signing up! Please click the button below to verify your email address:</p>
                  <a href="http://localhost:5173/verify/${token}">Verify Your Email</a>
                  <p>If you did not sign up for this account, you can ignore this email.</p>
              </div>
              <div class="email-footer">
                  <p>&copy; 2024 Your Company. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      `,
    });

    return res.json({
      msg: "Email sent, please check your email",
    });
  } catch (error) {
    return res.status(400).json({
      msg: "Email not sent",
    });

  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
