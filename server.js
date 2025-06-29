const express = require("express")
const nodemailer = require("nodemailer")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.status(200).send("🚀 Hello World! Server is Running");
});

app.post("/api/contact", async (req, res) => {
  const { name, email, phone, company, role, message, serviceInterest } = req.body

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.TO_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p><strong>Service Interest:</strong> ${serviceInterest}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    })

    res.status(200).json({ message: "Email sent successfully" })
  } catch (err) {
    console.error("Email error:", err)
    res.status(500).json({ error: "Failed to send email" })
  }
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
