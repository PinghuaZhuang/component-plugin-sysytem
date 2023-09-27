/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useEffect, useImperativeHandle } from 'react';
import type { ListProps } from './';
import { EventEmitter } from 'events';
import { createExtendParams, createMethods } from './utils';

export function useInit(
  props: ListProps,
  ref: React.ForwardedRef<{ uninstall: (name: string) => void }>,
) {
  const { plugins, onInit } = props;
  const emiter = useMemo(() => new EventEmitter(), []);
  const allPluginParams = useMemo(() => ({}), []);
  const extendsParams = useMemo(() => createExtendParams(allPluginParams), []);
  const methods = createMethods({ emiter, extendsParams });
  const uninstallHandlers = useMemo(
    () => ({} as Record<string, () => void>),
    [],
  );

  useMemo(() => {
    const initParams = { methods, context: { allPluginParams } };
    emiter.emit('init', initParams);
    onInit && onInit(initParams);

    plugins?.forEach((mod) => {
      const uninstall = mod(methods);
      uninstallHandlers[mod.name] = () => {
        if (uninstall == null) {
          console.warn(`>>> ${mod.name} 插件没有卸载方法.`);
          return;
        }
        const index = plugins.findIndex((o) => o === mod);
        if (index >= 0) plugins.splice(index, 1);
        uninstall();
      };
    });
  }, []);

  useImperativeHandle(ref, () => {
    return {
      // ⚠️ 卸载后就不要安装了. 因为组件并不会重新走一遍生命周期.
      uninstall(name) {
        if (uninstallHandlers[name]) {
          uninstallHandlers[name]();
        }
      },
    };
  });

  return {
    ...props,
    methods,
    allPluginParams,
  };
}

export function useMounted(
  params: ReturnType<typeof useInit>,
  {
    containerRef,
  }: {
    containerRef: React.RefObject<HTMLDivElement>;
  },
) {
  const { methods } = params;
  const { emit } = methods;

  useEffect(() => {
    emit(
      'mounted',
      {
        container: containerRef.current,
      },
      methods,
    );
  }, []);
}
