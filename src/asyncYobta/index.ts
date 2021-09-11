import { asyncPipe } from '..'
import {
  AsyncRules,
  AsyncRulesChain1,
  AsyncRulesChain2,
  AsyncRulesChain3,
  AsyncRulesChain4,
  AsyncRulesChain5,
  AsyncRulesChain6,
  AsyncRulesChain7
} from '../createRule'
import { parseUnknownError } from '../parseUnknownError'
import { PipedFactories, PipeFactoryResult } from '../pipe'
import { YobtaContext } from '../YobtaContext'
import { YobtaError } from '../YobtaError'

//#region Types
export type AsyncYobtaRule<I, O> = (input: I) => O | Promise<O>
export interface AsyncYobta {
  <R1, R2, R3, R4, R5, R6, R7>(
    ...rules: AsyncRulesChain7<R1, R2, R3, R4, R5, R6, R7>
  ): AsyncYobtaRule<any, R7>
  <R1, R2, R3, R4, R5, R6>(
    ...rules: AsyncRulesChain6<R1, R2, R3, R4, R5, R6>
  ): AsyncYobtaRule<any, R6>
  <R1, R2, R3, R4, R5>(
    ...rules: AsyncRulesChain5<R1, R2, R3, R4, R5>
  ): AsyncYobtaRule<any, R5>
  <R1, R2, R3, R4>(...rules: AsyncRulesChain4<R1, R2, R3, R4>): AsyncYobtaRule<
    any,
    R4
  >
  <R1, R2, R3>(...rules: AsyncRulesChain3<R1, R2, R3>): AsyncYobtaRule<any, R3>
  <R1, R2>(...rules: AsyncRulesChain2<R1, R2>): AsyncYobtaRule<any, R2>
  <R1>(...rules: AsyncRulesChain1<R1>): AsyncYobtaRule<any, R1>
  <R extends AsyncRules>(...rules: PipedFactories<R>): (
    input: any
  ) => Promise<Success<R> | Failure>
}
//#endregion

type Success<R extends AsyncRules> = [PipeFactoryResult<R>, null]
type Failure = [null, YobtaError[]]

const field = '@'

export const asyncYobta: AsyncYobta =
  <R extends AsyncRules>(...rules: R) =>
  async (data: any) => {
    let errors: YobtaError[] = []
    function pushError(error: YobtaError): void {
      errors.push(error)
    }
    let context: YobtaContext = {
      data,
      errors,
      field,
      path: [],
      pushError
    }

    let validators = rules.map(next => next(context)) as AsyncRules

    try {
      let result: PipeFactoryResult<R> = await asyncPipe(...validators)(data)
      if (errors.length) {
        return [null, errors] as Failure
      }
      return [result, null] as Success<R>
    } catch (error) {
      let { name, message } = parseUnknownError(error)
      pushError({ field, name, message, path: [] })
      return [null, errors] as Failure
    }
  }
