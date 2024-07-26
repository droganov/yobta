/* eslint-disable import/extensions */
import { differentYobta, effectYobta, fallback, identicalYobta, pipe } from '..'
import { createValidator } from '../createValidator/createValidator'
import { requiredYobta } from '../requiredYobta'
import { stringMessage, stringYobta } from '../stringYobta'
import { YobtaError } from '../YobtaError'
import { shape, shapeMessage } from './shape'

const validate = createValidator(
  shape({
    name: pipe(requiredYobta(), stringYobta()),
  }),
)

it('accepts valid shapes', () => {
  const result = validate({
    name: 'yobta',
  })
  expect(result).toEqual({ name: 'yobta' })
})

it('accepts valid shapes with overload', () => {
  const result = validate({
    age: 0,
    name: 'yobta',
  })

  expect(result).toEqual({ age: 0, name: 'yobta' })
})

it('rejects invalid input', () => {
  const attempt = (): any => validate([])
  expect(attempt).toThrow(shapeMessage)
})

it('coerces undefined', () => {
  const result = createValidator(shape({}))(undefined)
  expect(result).toEqual({})
})

it('has custom error messages', () => {
  const attempt = (): any =>
    createValidator(
      shape(
        {
          name: stringYobta(),
        },
        'yobta!',
      ),
    )([])
  expect(attempt).toThrow('yobta!')
})

it('captures errors from field validators', () => {
  const attempt = (): any =>
    validate({
      name: [],
    })
  expect(attempt).toThrow(stringMessage)
})

it('preserves yobta error', () => {
  const yobtaError = new YobtaError({
    field: 'yobta',
    message: 'yobta',
    path: [],
  })
  const attempt = (): any =>
    createValidator(
      shape({
        name: effectYobta(() => {
          throw yobtaError
        }),
      }),
    )({
      name: 'yobta',
    })
  expect(attempt).toThrow(yobtaError)
})

it('should replace context.data', () => {
  const replaced = {
    newPassword: 'new yobta',
    password: 'old yobta',
    retypePassword: 'new yobta',
  }
  const attempt = createValidator(
    fallback(() => replaced),
    shape({
      newPassword: differentYobta(['password']),
      password: stringYobta(),
      retypePassword: identicalYobta(['newPassword']),
    }),
  )
  const result = attempt(undefined)
  expect(result).toEqual(replaced)
})
