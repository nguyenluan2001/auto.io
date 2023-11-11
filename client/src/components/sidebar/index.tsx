import React from 'react';
import { useFlow } from '@/store/flow';
import { config } from '@/utils/nodeConfig';

function Sidebar() {
  const selectedNode = useFlow((state) => state.selectedNode);
  console.log('🚀 ===== Sidebar ===== selectedNode:', selectedNode);
  console.log('config', config);
  return (
    <div style={{ width: '300px', background: 'cyan' }}>
      <h6>Sidebar</h6>
      {selectedNode && React.createElement(config?.[selectedNode?.data?.name])}
    </div>
  );
}
export default Sidebar;
