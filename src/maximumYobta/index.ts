import { createRule, Rule } from '../createRule'

export const maximumYobtaMessage = (limit: number): string =>
  `It should be within ${limit}`

export const maximumYobta = (
  limit: number,
  message = maximumYobtaMessage
): Rule<number, number> =>
  createRule(input => {
    if (input > limit) throw new Error(message(limit))

    return input
  })
