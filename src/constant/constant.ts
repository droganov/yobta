import type { YobtaMaybe } from '../_types/YobtaMaybe.js'
import type { YobtaSyncRule } from '../rule/rule.js'
import { rule } from '../rule/rule.js'

export const constantMessage = <I>(value: I): string =>
  `Should be identical to "${String(value)}"`

export function constant<I, O>(
  value: O,
  message?: string,
): YobtaSyncRule<I, YobtaMaybe<I, O>> {
  return rule((input: I) => {
    if (input === undefined || input === value) {
      return input as YobtaMaybe<I, O>
    }

    throw new Error(message ?? constantMessage(value))
  })
}
