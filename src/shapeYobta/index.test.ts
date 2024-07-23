/* eslint-disable import/extensions */
import {
  defaultYobta,
  differentYobta,
  effectYobta,
  identicalYobta,
  pipe,
} from '../'
import { createValidator } from '../createValidator/createValidator'
import { requiredYobta } from '../requiredYobta/'
import { stringMessage, stringYobta } from '../stringYobta/'
import { YobtaError } from '../YobtaError/'
import { shapeMessage, shapeYobta } from './'

const validate = createValidator(
  shapeYobta({
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
  const result = createValidator(shapeYobta({}))(undefined)
  expect(result).toEqual({})
})

it('has custom error messages', () => {
  const attempt = (): any =>
    createValidator(
      shapeYobta(
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
      shapeYobta({
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
    defaultYobta(replaced),
    shapeYobta({
      newPassword: differentYobta(['password']),
      password: stringYobta(),
      retypePassword: identicalYobta(['newPassword']),
    }),
  )
  const result = attempt(undefined)
  expect(result).toEqual(replaced)
})
