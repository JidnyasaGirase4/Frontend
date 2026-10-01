import nodemailer from 'nodemailer'

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM, NOTIFY_EMAIL } = process.env

const enabled = Boolean(SMTP_HOST && NOTIFY_EMAIL)

const transporter = enabled
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: Number(SMTP_PORT) === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    })
  : null

if (!enabled) {
  console.log('Email disabled: set SMTP_HOST and NOTIFY_EMAIL to send enquiry notifications.')
}

// Strip line breaks so user-supplied values can never inject extra mail headers.
const oneLine = (value) => String(value ?? '').replace(/[\r\n]+/g, ' ').trim()

async function send(message) {
  if (!transporter) return
  await transporter.sendMail({ from: MAIL_FROM || SMTP_USER, ...message })
}

export async function sendEnquiryEmails(e) {
  await send({
    to: NOTIFY_EMAIL,
    replyTo: oneLine(e.email),
    subject: `New enquiry from ${oneLine(e.fullName)}`,
    text: [
      `Name: ${e.fullName}`,
      `Phone: ${e.phone}`,
      `Email: ${e.email}`,
      `Property type: ${e.propertyType || '-'}`,
      `Address / city: ${e.address}`,
      `Monthly bill: ${e.monthlyBill || '-'}`,
      `Service: ${e.serviceInterested || '-'}`,
      '',
      'Message:',
      e.message || '-',
    ].join('\n'),
  })

  await send({
    to: oneLine(e.email),
    subject: 'We received your enquiry - Ignite Solar',
    text: `Hi ${oneLine(e.fullName)},\n\nThank you for contacting Ignite Solar. We have received your enquiry and our team will get back to you within 24 hours.\n\nRegards,\nIgnite Solar`,
  })
}

export async function sendContactEmails(c) {
  await send({
    to: NOTIFY_EMAIL,
    replyTo: oneLine(c.email),
    subject: `New contact message from ${oneLine(c.name)}`,
    text: [`Name: ${c.name}`, `Email: ${c.email}`, `Phone: ${c.phone || '-'}`, '', 'Message:', c.message].join('\n'),
  })

  await send({
    to: oneLine(c.email),
    subject: 'We received your message - Ignite Solar',
    text: `Hi ${oneLine(c.name)},\n\nThanks for reaching out to Ignite Solar. We have received your message and will reply shortly.\n\nRegards,\nIgnite Solar`,
  })
}
