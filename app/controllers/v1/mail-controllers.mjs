import { Resolver } from 'dns/promises'
const resolver = new Resolver()

const checkMx = async (req, reply) => {
  const { params: { email } } = req

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
  };

  try {
    const result = await mxExists(email)
    reply.status(200).send({ status: 200, message: "ok", mxExists: result })
  } catch (error) {
    reply
      .status(500)
      .send({ status: 500, message: "Internal Server Error", mxExists: false })
  }
};

export { checkMx }
