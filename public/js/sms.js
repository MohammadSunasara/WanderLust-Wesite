async function sendEmail(to, subject, message) {
  try {
    let mailOptions = {
      from: 'your-email-address@example.com', // your email address
      to: to,
      subject: subject,
      text: message
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}