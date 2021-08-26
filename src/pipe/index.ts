export type Factory = (config: any) => (arg: any) => any
export type Factories = [Factory, ...Factory[]]

export type PipedFactories<F extends Factories> = F & AsFactoryChain<F>
type AsFactoryChain<F extends Factories, T extends Factory[] = Tail<F>> = {
  [K in keyof F]: (
    arg: ArgType<FactoryProduct<F, T, K>>
  ) => FactoryProduct<F, T, K>
}
type FactoryProduct<
  F extends Factories,
  T extends Factory[],
  K extends keyof F
> = (arg: ArgType<F>) => ArgType<Lookup<ExtractReturnTypes<T>, K, any>, any>

export type ExtractReturnTypes<T extends Func1[]> = {
  [P in keyof T]: T[P] extends (a: ArgType<T[P]>) => infer R ? R : never
}

export type PipeFactoryResult<F extends Factories> = LaxReturnType<
  Last<ExtractReturnTypes<F>>
>

export type Lookup<T, K extends keyof any, Else = never> = K extends keyof T
  ? T[K]
  : Else
export type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never
export type Func1 = (arg: any) => any
export type ArgType<F, Else = never> = F extends (arg: infer A) => any
  ? A
  : Else
type AsChain<F extends [Func1, ...Func1[]], G extends Func1[] = Tail<F>> = {
  [K in keyof F]: (arg: ArgType<F[K]>) => ArgType<Lookup<G, K, any>, any>
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Last<T extends any[]> = T extends [...infer F, infer L] ? L : never
export type LaxReturnType<F> = F extends (...args: any) => infer R ? R : never

export type Functions = [Func1, ...Func1[]]
export type PipedFunctions<F extends Functions> = F & AsChain<F>
export type PipeResult<F extends Functions> = LaxReturnType<Last<F>>
export type PipeFunction<F extends Functions, I> = (
  ...functions: PipedFunctions<F>
) => (input: I) => PipeResult<F>

export type ThenArgRecursive<T> = T extends PromiseLike<infer U>
  ? ThenArgRecursive<U>
  : T

export const pipe =
  <F extends Functions>(...functions: PipedFunctions<F>) =>
  (input: ArgType<F[0]>): PipeResult<F> =>
    functions.reduce((prev, next) => next(prev), input) as PipeResult<F>
