import { Box, Button, Stack } from '@mui/material';
import { ReactFlowInstance, ReactFlowProvider } from 'reactflow';
import { useCallback, useRef, useState } from 'react';
import Editor from '@/components/editor';
import Sidebar from '@/components/sidebar';
import { useFlow } from '@/store/flow';

import { generateNode } from './utils/generateNode';

let id = 0;
const getId = () => `dndnode_${id++}`;
function App() {
  const setNodes = useFlow((state: any) => state.setNodes);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>(null);
  const reactFlowWrapper = useRef(null);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      console.log('🚀 ===== App ===== type:', type);

      // check if the dropped element is valid
      // if (typeof type === 'undefined' || !type) {
      //   return;
      // }

      // reactFlowInstance.project was renamed to reactFlowInstance.screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      // const newNode = {
      //   id: getId(),
      //   type,
      //   position,
      //   data: { label: `${type}` },
      // };
      const newNode = generateNode({ type, position });
      console.log('🚀 ===== App ===== newNode:', newNode);

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );
  return (
    <ReactFlowProvider>
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <Stack
          direction="row"
          style={{
            width: '100vw',
            overflow: 'hidden',
          }}
        >
          <Sidebar />
          <Box style={{ flex: 1 }}>
            <Editor
              onDrop={onDrop}
              onDragOver={onDragOver}
              setReactFlowInstance={setReactFlowInstance}
            />
          </Box>
        </Stack>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
