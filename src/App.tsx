/* eslint-disable @typescript-eslint/no-explicit-any */
import './App.css';
import { useCallback, useRef, useState } from 'react';
import List from './components/List';
import Sorter from './components/List/plugins/sorter';

function App() {
  const ListRef = useRef<{
    uninstall: (name: string) => void;
  }>(null);

  const onInit = useCallback(({ methods: { on } }: any) => {
    on('sort:beforeCreate', ({ sortableParams }: any) => {
      console.log(`>>> onSortBefore change sortable option.`);
      sortableParams.animation = 400;
    });
    on('sort:sort', console.log);
  }, []);

  const [plugins, setPlugins] = useState([Sorter]);

  const uninstallSorter = useCallback(() => {
    ListRef.current?.uninstall(Sorter.pluginName);
    plugins.splice(plugins.findIndex(o => o.pluginName === Sorter.pluginName), 1);
    setPlugins([...plugins]);
  }, [plugins]);

  return (
    <div>
      <h3>List component</h3>
      <h4>Plugins: {plugins.map((o) => o.pluginName).join(', ')}</h4>
      <div>
        <button
          style={{
            marginBottom: 20,
            backgroundColor: 'gray',
          }}
          onClick={uninstallSorter}
        >
          卸载 Sorter
        </button>
        <div>组件并不会重新走一遍生命周期, 所以不建议重新安装.</div>
        <div>可以通过修改key的方式装卸载.</div>
      </div>
      <div>
        <List
          ref={ListRef}
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
