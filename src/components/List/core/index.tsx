/* eslint-disable @typescript-eslint/no-explicit-any */
import './styles.less';
import { useRef, forwardRef } from 'react';
import { useInit, useMounted } from './hooks';
import { createExtendParams, createMethods } from './utils';

export type Item = {
  label: string;
  value: string;
};

export type Methods = ReturnType<typeof createMethods>;
export type HookOption = { methods: Methods; context: Record<string, any> };

type EventNoop = (
  eventName: string,
  handler: (event: any, context: Parameters<Plugin>[0]) => void,
) => void;

export type Plugin = (pluginOption: {
  extendsParams: ReturnType<typeof createExtendParams>;
  on: EventNoop;
  once: EventNoop;
  off: EventNoop;
  emit: (eventName: string, event: any) => void;
}) => void | (() => void);

export interface ListProps {
  options: Item[];
  plugins?: Plugin[];
  onInit?: (option: HookOption) => void;
  onMounted?: (option: HookOption) => void;
  // onSort?: () => ListProps['options'];
}

const List = forwardRef<{ uninstall: (name: string) => void }, ListProps>(
  (props, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const params = useInit(props, ref);

    const { options } = params;
    useMounted(params, {
      containerRef,
    });
    console.log('params', params);

    return (
      <div ref={containerRef} className="normal-list">
        {options.map((o, index) => {
          return (
            <div
              key={o.value ?? index}
              className="normal-list-item"
              data-value={o.value}
              data-list-item
            >
              {o.label}
            </div>
          );
        })}
      </div>
    );
  },
);

export default List;
