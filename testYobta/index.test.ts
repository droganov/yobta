import { syncYobta } from '../syncYobta/index.js'
import { testYobta, testMessage } from './index.js'

const regExp = /fo*/

const customMessage = 'yobta!'
const validate = syncYobta(testYobta(regExp, customMessage))

it('accepts if mathed', () => {
  let result = validate('table football')
  expect(result).toEqual(['table football', null])
})

it('regects if not matched', () => {
  let result = validate('yobta')
  expect(result).toEqual([
    null,
    [{ field: '@root', message: customMessage, path: [] }]
  ])
})

it('has default error message', () => {
  let validateDefault = syncYobta(testYobta(regExp))
  let result = validateDefault('yobta')
  expect(result).toEqual([
    null,
    [{ field: '@root', message: testMessage, path: [] }]
  ])
})
