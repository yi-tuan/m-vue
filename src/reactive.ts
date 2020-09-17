export const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  RAW = '__v_raw'
}

export interface Target {
  [ReactiveFlags.SKIP]?: boolean
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.IS_READONLY]?: boolean
  [ReactiveFlags.RAW]?: any
}

// export function reactive(target: object) {
//   // if trying to observe a readonly proxy, return the readonly version.
//   if (target && (target as Target)[ReactiveFlags.IS_READONLY]) {
//     return target
//   }

//   return createReactiveObject(
//     target,
//     false,
//     mutableHandlers,
//     mutableCollectionHandlers
//   )
// }