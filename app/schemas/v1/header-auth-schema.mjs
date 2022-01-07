const authSchema = {
  type: 'object',
  required: ['Authorization'],
  properties: {
    token: {
      type: 'string'
    }
  }
}

export { authSchema }
