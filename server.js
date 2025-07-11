import express from "express";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import cors from "cors";
import validator from "validator";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post("/send-email", async (req, res) => {
    const { email, chartImage } = req.body;
    const base64Regex = /^data:image\/png;base64,[A-Za-z0-9+/=]+$/;

    if (!validator.isEmail(email)) {
        return res.status(400).send("Invalid email address.");
    }
    if (!base64Regex.test(chartImage)) {
        return res.status(400).send("Invalid chart image.");
    }
    if (!process.env.USER || !process.env.API_KEY) {
        throw new Error("Environment variables USER and API_KEY must be set.");
    }

    console.log("Send email works with email:", { email, chartImage });

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.resend.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER,
                pass: process.env.API_KEY,
            },
        });

        const mailOptions = {
            from: "test@resend.dev",
            to: email,
            subject: "Your Chart Image",
            html: "<p>Here is your chart image:</p>",
            attachments: [
                {
                    filename: "chart.png",
                    content: chartImage.split("base64,")[1],
                    encoding: "base64",
                },
            ],
        };

        await transporter.sendMail(mailOptions);
        res.status(200).send("Email sent successfully!");
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Failed to send email.");
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
