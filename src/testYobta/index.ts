import { ruleYobta, SyncRule } from '../ruleYobta'

export const testMessage = 'Invalid format'

interface TestFactory {
  (expression: RegExp, message?: string): SyncRule<string, string>
}

export const testYobta: TestFactory = (
  expression: RegExp,
  message = testMessage,
) =>
  ruleYobta(input => {
    if (expression.test(input)) return input
    throw new Error(message)
  })
