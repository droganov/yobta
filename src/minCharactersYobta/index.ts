import { createRule, Rule } from '../createRule'
import { pluralizeEn } from '../pluralizeEn'

export const minCharactersMessage = (limit: number): string =>
  `It should have at least ${pluralizeEn(limit, 'character')}`

export const minCharactersYobta = (
  limit: number,
  message = minCharactersMessage
): Rule<string, string> =>
  createRule(input => {
    if (input.length < limit) throw new Error(message(limit))

    return input
  })
