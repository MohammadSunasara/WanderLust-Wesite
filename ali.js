
const nodemailer = require('nodemailer');
const express=require("express")
const app=express()



// Create a Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mohammadali13703@gmail.com', // Replace with your Gmail address
    pass: 'isgq tryk cwpu dpbp'   // Replace with your Gmail App Password
  }
});

// Email options
const mailOptions = {
  from: 'mohammadali13703@gmail.com', // Replace with your Gmail address
  to: 'shirinafatema786@gmail.com',  // Replace with the recipient's email address
  subject: 'Test Email',
  text: 'Hello, this is a test email sent from Node.js using Nodemailer!'
};

// Send email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error: ' + error.toString());
  }
  console.log('Email sent: ' + info.response);
});
