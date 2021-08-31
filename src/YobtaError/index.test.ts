import { YobtaError } from '.'

it('extends Error', () => {
  let error = new YobtaError({ field: '@root', message: 'yobta', path: [] })
  expect(error instanceof Error).toBe(true)
})

it('has metadata', () => {
  let error = new YobtaError({ field: 'f1', message: 'yobta', path: ['yobta'] })
  expect(error.field).toBe('f1')
  expect(error.message).toBe('yobta')
  expect(error.path).toEqual(['yobta'])
})
