/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useEffect } from 'react';
import type { ListProps } from './';
import { EventEmitter } from 'events';
import { createExtendParams, createMethods } from './utils';

export function useInit(props: ListProps) {
  const { plugins, onInit } = props;
  const emiter = useMemo(() => new EventEmitter(), []);
  const allPluginParams = useMemo(() => ({}), []);
  const extendsParams = useMemo(
    () => createExtendParams(allPluginParams),
    [],
  );
  const methods = createMethods({ emiter, extendsParams });

  useMemo(() => {
    const initParams = { methods, context: { allPluginParams } };
    emiter.emit('init', initParams);
    onInit && onInit(initParams);

    plugins?.forEach((mod) => {
      mod(methods);
    });
  }, []);

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
