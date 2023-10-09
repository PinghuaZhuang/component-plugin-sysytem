/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file 支持元素拖动排序
 */
import type { Item, Plugin } from '@/components/List';
import Sortable from 'sortablejs';

export interface SorterItem extends Item {
  sort?: number;
}

const Sorter: Plugin = (methods) => {
  console.log(`>>> install sorter success.`);
  const { on, extendsParams, emit } = methods;
  import('./styles.less');

  let sortable: Sortable | null = null;

  const handler = ({ container }: { container: HTMLDivElement }) => {
    const sortableParams: Sortable.Options = {
      draggable: '[data-list-item]',
      animation: 150,
      sort: true,
      onSort(event) {
        emit('sort:sort', { sortableParams, event });
      },
    };
    emit('sort:beforeCreate', { sortableParams });
    sortable = new Sortable(container, sortableParams);
    extendsParams({ sortable, sortableParams }, {});
  };

  on('mounted', handler);

  return function uninstall() {
    const { off } = methods;
    off('mounted', handler);
    extendsParams({ sortable: null, sortableParams: null }, {});
    sortable?.destroy();
    console.log(`>>> uninstall Sorter.`);
    emit('sort:uninstalled', undefined);
  }
};

Sorter.pluginName = 'Sorter';

export default Sorter;
