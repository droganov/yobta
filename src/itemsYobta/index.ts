import {
  createRule,
  SyncRule,
  SyncRulesChain1,
  SyncRulesChain2,
  SyncRulesChain3,
  SyncRulesChain4,
  SyncRulesChain5,
  SyncRulesChain6,
  SyncRulesChain7,
  SyncRulesChain8,
  SyncRulesChain9
} from '../createRule'
import { Functions, pipe } from '../pipe'
import { YobtaError } from '../YobtaError'

export interface ItemsYobta {
  <R1, R2, R3, R4, R5, R6, R7, R8, R9>(
    ...rules: SyncRulesChain9<R1, R2, R3, R4, R5, R6, R7, R8, R9>
  ): SyncRule<any[], R9[]>
  <R1, R2, R3, R4, R5, R6, R7, R8>(
    ...rules: SyncRulesChain8<R1, R2, R3, R4, R5, R6, R7, R8>
  ): SyncRule<any[], R8[]>
  <R1, R2, R3, R4, R5, R6, R7>(
    ...rules: SyncRulesChain7<R1, R2, R3, R4, R5, R6, R7>
  ): SyncRule<any[], R7[]>
  <R1, R2, R3, R4, R5, R6>(
    ...rules: SyncRulesChain6<R1, R2, R3, R4, R5, R6>
  ): SyncRule<any[], R6[]>
  <R1, R2, R3, R4, R5>(...rules: SyncRulesChain5<R1, R2, R3, R4, R5>): SyncRule<
    any,
    R5[]
  >
  <R1, R2, R3, R4>(...rules: SyncRulesChain4<R1, R2, R3, R4>): SyncRule<
    any[],
    R4[]
  >
  <R1, R2, R3>(...rules: SyncRulesChain3<R1, R2, R3>): SyncRule<any[], R3[]>
  <R1, R2>(...rules: SyncRulesChain2<R1, R2>): SyncRule<any[], R2[]>
  <R1>(...rules: SyncRulesChain1<R1>): SyncRule<any[], R1[]>
}

export const itemsYobta: ItemsYobta = (...rules: SyncRule<any[], any>[]) => {
  return createRule((input: any[], context) => {
    let next = rules.map(rule => rule(context)) as Functions

    return input.map((item, index) => {
      try {
        return pipe(...next)(item)
      } catch (error) {
        context.pushError(
          new YobtaError({
            message: error.message,
            field: context.field,
            path: [...context.path, index]
          })
        )
        return item
      }
    })
  })
}
