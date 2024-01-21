const transporter = require('./transporter.js');

const sendEmailConfirm = (participant, event) => {
  const mailOptions = {
    from: 'makerspace.powerup@gmail.com',
    to: participant.email,
    subject: 'Registration Confirmation',
    text: `Dear ${participant.firstname},

        Thank you for registering for the ${event.name} event! We are excited to have you join us.

        Event Details:
        
        - Event Name: ${event.name}
        - Start: ${event.startTime}
        - End: ${event.endTime}
        - Location: ${event.location}
        
        We can't wait to see you there! If you have any questions or need further information, feel free to contact us.
        
        Best regards,
        Your Event Team`,

  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email sending failed:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = sendEmailConfirm;
