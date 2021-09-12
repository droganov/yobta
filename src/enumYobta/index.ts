import { createRule, SyncRule } from '../createRule'

type TrustedItems = (string | number | symbol)[]

interface EnumMessage {
  (items: TrustedItems): string
}

interface EnymYobta {
  <T extends TrustedItems>(items: T, message?: EnumMessage): SyncRule<
    any,
    T[number] | undefined
  >
}

export const enumMessage: EnumMessage = items =>
  `It should be one of: ${items.join(', ')}`

export const enumYobta: EnymYobta = (items, message = enumMessage) =>
  createRule(input => {
    if (items.includes(input) || typeof input === 'undefined') return input
    throw new Error(message(items))
  })
