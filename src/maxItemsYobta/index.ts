import { createRule, Rule } from '../createRule'
import { pluralizeEn } from '../pluralizeEn'

export const maxItemsMessage = (limit: number): string =>
  `It should be within ${pluralizeEn(limit, 'item')}`

export const maxItemsYobta = <I extends any[]>(
  limit: number,
  message = maxItemsMessage
): Rule<I, I> =>
  createRule(input => {
    if (input.length > limit) throw new Error(message(limit))

    return input
  })
