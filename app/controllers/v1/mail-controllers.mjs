import { mxExists, sendMailMessage } from '../../services/v1/mail-services.mjs'

const checkMx = async (req, reply) => {
  const { params: { email } } = req

  try {
    const result = await mxExists(email)
    reply.status(200).send({ status: 200, message: "ok", mxExists: result })
  } catch (error) {
    reply
      .status(500)
      .send({ status: 500, message: "Internal Server Error", mxExists: false })
  }
};

async function sendContactFormMessage(req, reply) {
  const { config: {
    CONTACT_SMTP_HOST: host,
    CONTACT_SMTP_PORT: port,
    CONTACT_SMTP_SECURE: secure,
    CONTACT_SMTP_USER: user,
    CONTACT_SMPT_PASS: pass
  }
} = this

  const {
    body: { mailOptions }
  } = req;

  // TODO: Validate Mail Options

  try {
    const result = await sendMailMessage(host, pass, port, secure, user, mailOptions)
    reply
      .status(200)
      .send(result)
  } catch (error) {
    reply
      .status(500)
      .send({ error })
  }
}

export { checkMx, sendContactFormMessage }
