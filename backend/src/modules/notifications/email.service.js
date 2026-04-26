const sgMail = require('@sendgrid/mail');

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

exports.sendEmail = async (options) => {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn(`⚠️ Running in Mock Email Mode: Assuming email sent to ${options.to}`);
    console.warn(`Subject: ${options.subject}`);
    return;
  }

  const msg = {
    to: options.to,
    from: 'support@karobaar.ai', // Verified sender in SendGrid
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  await sgMail.send(msg);
};

exports.sendWelcomeEmail = async (email, name) => {
  await this.sendEmail({
    to: email,
    subject: 'Welcome to Karobaar AI Co-Pilot!',
    text: `Hi ${name},\n\nWelcome to Karobaar AI. Your journey to optimized e-commerce starts here.`,
    html: `<strong>Hi ${name},</strong><br/><br/>Welcome to Karobaar AI. Your journey to optimized e-commerce starts here.`
  });
};

exports.sendPaymentConfirmation = async (email, plan, amount) => {
  await this.sendEmail({
    to: email,
    subject: `Subscription Confirmed: Karobaar ${plan}`,
    text: `Your subscription to the ${plan} plan has been processed successfully. Amount: ₹${amount}`,
    html: `Your subscription to the <strong>${plan}</strong> plan has been processed successfully. <br/>Amount: ₹${amount}`
  });
};
