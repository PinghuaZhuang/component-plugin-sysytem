/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css';
import { useCallback } from 'react';
import List from './components/List';
import Sorter from './components/List/plugins/sorter';

function App() {
  const onInit = useCallback(({ methods: { on } }: any) => {
    on('sort:beforeCreate', ({ sortableParams }: any) => {
      console.log(`>>> onSortBefore change sortable option.`);
      sortableParams.animation = 400;
    });
    on('sort:sort', console.log);
  }, []);

  const plugins = [Sorter];

  return (
    <div>
      <h3>List component</h3>
      <h4>Plugins: {plugins.map(o => o.name).join(', ')}</h4>
      <div>
        <List
          options={Array.from({ length: 10 }).map((_, index) => {
            return {
              label: `这是第${index}条数据`,
              value: String(index),
            };
          })}
          plugins={plugins}
          onInit={onInit}
        />
      </div>
    </div>
  );
}

export default App;
