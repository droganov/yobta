import {
  SyncRule,
  SyncRules,
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
import { pipe } from '../pipe'
import { YobtaContext } from '../YobtaContext'
import { YobtaError } from '../YobtaError'

//#region Types
export type SyncYobtaRule<I, O> = (input: I) => O
export interface SyncYobta {
  <R1>(...rules: SyncRulesChain1<R1>): SyncYobtaRule<any, R1>
  <R1, R2, R3, R4, R5, R6, R7, R8, R9>(
    ...rules: SyncRulesChain9<R1, R2, R3, R4, R5, R6, R7, R8, R9>
  ): SyncYobtaRule<any, R9>
  <R1, R2, R3, R4, R5, R6, R7, R8>(
    ...rules: SyncRulesChain8<R1, R2, R3, R4, R5, R6, R7, R8>
  ): SyncYobtaRule<any, R8>
  <R1, R2, R3, R4, R5, R6, R7>(
    ...rules: SyncRulesChain7<R1, R2, R3, R4, R5, R6, R7>
  ): SyncYobtaRule<any, R7>
  <R1, R2, R3, R4, R5, R6>(
    ...rules: SyncRulesChain6<R1, R2, R3, R4, R5, R6>
  ): SyncYobtaRule<any, R6>
  <R1, R2, R3, R4, R5>(
    ...rules: SyncRulesChain5<R1, R2, R3, R4, R5>
  ): SyncYobtaRule<any, R5>
  <R1, R2, R3, R4>(...rules: SyncRulesChain4<R1, R2, R3, R4>): SyncYobtaRule<
    any,
    R4
  >
  <R1, R2, R3>(...rules: SyncRulesChain3<R1, R2, R3>): SyncYobtaRule<any, R3>
  <R1, R2>(...rules: SyncRulesChain2<R1, R2>): SyncYobtaRule<any, R2>
}
//#endregion

const field = '@root'

export const syncYobta: SyncYobta =
  (...rules: SyncRule<any, any>[]) =>
  (data: any) => {
    let context: YobtaContext = {
      data,
      field,
      path: [],
      pushError(error: YobtaError) {
        throw error
      }
    }

    let validators = rules.map(next => next(context)) as SyncRules

    try {
      return pipe(...validators)(data)
    } catch (error) {
      throw new YobtaError({ field, message: error.message, path: [] })
    }
  }
