const transporter = require('./transporter.js');

const sendEmailRemoved = (participant, event) => {
    const mailOptions = {
        from: 'makerspace.powerup@gmail.com',
        to: participant.email,
        subject: 'Event Removal Confirmation',
        text: `Dear ${participant.firstname},

    We have received your request to remove yourself from the ${event.name} event. Your registration has been successfully canceled.

    Event Details:
    
    - Event Name: ${event.name}
    - Start: ${event.startTime}
    - End: ${event.endTime}
    - Location: ${event.location}
    
    If you have any questions or if there's anything else we can assist you with, please feel free to contact us.

    We appreciate your understanding and hope to see you in future events.

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

module.exports = sendEmailRemoved;
