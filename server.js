const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/send-email", async (req, res) => {
    const { email, chartImage } = req.body;
    console.log("Send email works with email:", email);

    try {
        // Email sending logic
        res.status(200).send("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Failed to send email.");
    }

    // try {
    //     const transporter = nodemailer.createTransport({
    //         host: "smtp.gmail.com",
    //         port: 587, // Use port 587 for TLS
    //         secure: false, // Use TLS
    //         auth: {
    //             user: "your-email@gmail.com",
    //             pass: "your-email-password",
    //         },
    //     });

    //     const mailOptions = {
    //         from: "your-email@gmail.com",
    //         to: email,
    //         subject: "Your Chart Image",
    //         html: "<p>Here is your chart image:</p>",
    //         attachments: [
    //             {
    //                 filename: "chart.png",
    //                 content: chartImage.split("base64,")[1],
    //                 encoding: "base64",
    //             },
    //         ],
    //     };

    //     await transporter.sendMail(mailOptions);
    //     res.status(200).send("Email sent successfully!");
    // } catch (error) {
    //     console.error("Error sending email:", error);
    //     res.status(500).send("Failed to send email.");
    // }
});

app.listen(3000, () => console.log("Server running on port 3000"));
