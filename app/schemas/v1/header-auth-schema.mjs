const authSchema = {
  type: 'object',
  required: ['Authorization'],
  properties: {
    Authorization: {
      type: 'string'
    }
  }
}

export { authSchema }
