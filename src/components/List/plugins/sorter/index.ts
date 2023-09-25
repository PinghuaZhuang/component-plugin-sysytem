import type { Item, Plugin } from '@/components/List';
import Sortable from 'sortablejs';

export interface SorterItem extends Item {
  sort?: number;
}

const Sorter: Plugin = (methods) => {
  console.log(`>>> install sorter success.`);
  const { on, extendsParams, emit } = methods;

  on('mounted', ({ container }: { container: HTMLDivElement }) => {
    const sortableParams: Sortable.Options = {
      draggable: '[data-list-item]',
      animation: 150,
      sort: true,
      onSort(event) {
        emit('sort:sort', { sortableParams, event });
      },
    };
    emit('sort:beforeCreate', { sortableParams });
    const sortable = new Sortable(container, sortableParams);
    extendsParams({ sortable, sortableParams }, {});
  });
};

export default Sorter;
