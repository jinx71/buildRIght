const nodemailer = require('nodemailer');

let cachedTransporter;

const getTransporter = () => {
  if (cachedTransporter !== undefined) return cachedTransporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST) {
    cachedTransporter = null; // dev mode → log to console
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
  return cachedTransporter;
};

const formatBody = (q) =>
  [
    'New quote request from the BuildRight website:',
    '',
    `Name:        ${q.name}`,
    `Email:       ${q.email}`,
    `Phone:       ${q.phone || '—'}`,
    `Project:     ${q.projectType}`,
    `Budget:      ${q.budget != null ? `€${q.budget.toLocaleString()}` : '—'}`,
    `Area:        ${q.squareMeters != null ? `${q.squareMeters} m²` : '—'}`,
    '',
    'Message:',
    q.message || '(none)',
  ].join('\n');

// Returns info about how the mail was handled; never throws into the request flow.
const sendQuoteEmail = async (quote) => {
  const subject = `New quote request — ${quote.projectType} from ${quote.name}`;
  const text = formatBody(quote);
  const transporter = getTransporter();

  if (!transporter) {
    // eslint-disable-next-line no-console
    console.log(`\n📧 [dev] SMTP not configured — quote email would be sent:\nSubject: ${subject}\n${text}\n`);
    return { delivered: false, mode: 'console' };
  }

  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM || 'BuildRight <no-reply@buildright.dev>',
      to: process.env.MAIL_TO || 'quotes@buildright.dev',
      replyTo: quote.email,
      subject,
      text,
    });
    return { delivered: true, mode: 'smtp' };
  } catch (err) {
    // Email failure must not lose the lead — the quote is already saved in Mongo.
    // eslint-disable-next-line no-console
    console.error('✉️  Failed to send quote email:', err.message);
    return { delivered: false, mode: 'error', error: err.message };
  }
};

module.exports = { sendQuoteEmail };
