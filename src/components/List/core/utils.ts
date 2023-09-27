/* eslint-disable @typescript-eslint/no-explicit-any */
import { extend } from 'lodash';
import { EventEmitter } from 'events';

// export function assgin(source: any, target: any) {
//   for (const [k, v] of target) {
//     if (k in source) continue
//     source[k] = v;
//   }
// }

export function createExtendParams(allParams: Record<string, any>) {
  return function extendParams(
    userParams: Record<string, any>,
    pluginParams: Record<string, any>,
  ) {
    extend(allParams, userParams);
    extend(pluginParams, userParams);
  };
}

export function createMethods({
  emiter,
  extendsParams,
}: {
  emiter: EventEmitter;
  extendsParams: ReturnType<typeof createExtendParams>;
}) {
  return {
    extendsParams,
    on: emiter.on.bind(emiter),
    once: emiter.once.bind(emiter),
    off: emiter.off.bind(emiter),
    emit: emiter.emit.bind(emiter),
  };
}
