
const tokenGrantTypePasswordSchema = {
  body: {
    type: 'object',
    required: ['plaintextPassword', 'username'],
    properties: {
      plaintextPassword: { type: 'string' },
      username: { type: 'string' }
    },
    additionalProperties: false
  },
  response: {
    201: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            tokenType: { type: 'string' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' }
          }
        }
      }
    },
    400: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        type: { type: 'string' },
        message: { type: 'string' },
        validationResults: { type: 'array' }
      }
    },
    404: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        type: { type: 'string' },
        message: { type: 'string' }
      }
    },
    503: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        type: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
}

const tokenPublicKeySchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        data: {
          type: 'object',
          properties: {
            publicKey: { type: 'string' }
          }
        }
      }
    }
  }
}

export { tokenGrantTypePasswordSchema, tokenPublicKeySchema }
