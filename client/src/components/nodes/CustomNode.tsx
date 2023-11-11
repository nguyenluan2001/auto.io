import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { useFlow } from '@/store/flow';

const handleStyle = { left: 10 };

function CustomNode(node) {
  const setSelectedNode = useFlow((state) => state.setSelectedNode);
  const handleClickNode = () => {
    setSelectedNode(node);
  };

  return (
    <div style={{ border: '1px solid black' }} onClick={handleClickNode}>
      {node?.data?.name !== 'trigger' && (
        <Handle type="target" position={Position.Top} />
      )}
      <h6>{node?.data?.label}</h6>
      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
}
export default CustomNode;
