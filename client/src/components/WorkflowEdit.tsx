import { Box, Button, Stack } from '@mui/material';
import { Node, ReactFlowInstance, ReactFlowProvider } from 'reactflow';
import { useCallback, useRef, useState } from 'react';
import Editor from '@/components/editor';
import Sidebar from '@/components/sidebar';
import { useFlow } from '@/store/flow';

import { generateNode } from '@/utils/generateNode';
import ThemeConfig from '@/theme/Theme';

type Props = {
  refetch: () => void;
};

function WorkflowEdit({ refetch }: Props) {
  const { addNode, nodes } = useFlow();
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef(null);

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const position = (
        reactFlowInstance as ReactFlowInstance
      ).screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = generateNode({ type, position }) as Node;
      addNode((nds: Node[]) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );
  return (
    <ThemeConfig>
      <ReactFlowProvider>
        <Box
          sx={{ width: '100%', overflowX: 'hidden' }}
          className="reactflow-wrapper"
          ref={reactFlowWrapper}
        >
          <Stack
            direction="row"
            style={{
              overflow: 'hidden',
              flex: 1,
            }}
          >
            <Sidebar />
            <Box style={{ flex: 1 }}>
              <Editor
                onDrop={onDrop}
                onDragOver={onDragOver}
                setReactFlowInstance={setReactFlowInstance}
                refetch={refetch}
              />
            </Box>
          </Stack>
        </Box>
      </ReactFlowProvider>
    </ThemeConfig>
  );
}

export default WorkflowEdit;
