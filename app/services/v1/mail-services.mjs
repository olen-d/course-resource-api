import { Resolver } from 'dns/promises'
import * as nodemailer from 'nodemailer'

const resolver = new Resolver()

const mxExists = async emailAddress => {
  const hostname = emailAddress.split("@")[1]

  try {
    const addresses = await resolver.resolveMx(hostname)
    if (addresses && addresses.length > 0) {
      return addresses[0].exchange ? true : false
    }
  } catch (error) {
    // TODO: Deal with the error
    return false
  }
}

const sendMailMessage = (host, pass, port, secure, user, mailOptions) => {
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, success) => {
      if (err) {
        reject({ status: 'error', type: 'sendmail', message: 'unable to send one or more emails', error: err })
      } else {
        resolve(success)
      }
    })
  })
}

export { mxExists, sendMailMessage}
