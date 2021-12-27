import { sanitizeAll, trimAll } from "./input-services.mjs"; 

describe('input services tests', () => {
 test('should remove keys that start with $ from input', () => {
   const objTest = { username: { $gt: '' }, password: 'password1234' }
   const objEqual = { username: {}, password: 'password1234' }
   expect(sanitizeAll(objTest)).toEqual(objEqual)
 })
 test('should trim all strings in object values', () => {
   const objTest = { 
      emailAddress: ' fred@example.com',
      firstName: 'Fred ',
      lastName: '  Fredson',
      plainTextPassword: 'password1234  ',
      role: ' user ',
      username: '  fredf  '
    }
   const objEqual = { 
    emailAddress: 'fred@example.com',
    firstName: 'Fred',
    lastName: 'Fredson',
    plainTextPassword: 'password1234',
    role: 'user',
    username: 'fredf'
  }
   expect(trimAll(objTest)).toEqual(objEqual)
 })
})
