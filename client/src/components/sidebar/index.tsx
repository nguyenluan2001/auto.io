import React, { Component, FunctionComponent, ReactElement } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import chevronLeft from '@iconify/icons-mdi/chevron-left';
import { Icon } from '@iconify/react';
import { useFlow } from '@/store/flow';
import { config } from '@/utils/nodeConfig';
import Menu from './Menu';
import { EditForm } from './EditForm';

function Sidebar() {
  const selectedNode = useFlow((state: any) => state.selectedNode);
  const setSelectedNode = useFlow((state: any) => state.setSelectedNode);
  console.log('🚀 ===== Sidebar ===== selectedNode:', selectedNode);
  console.log('config', config);
  const handleBack = () => setSelectedNode(null);
  return (
    <Box sx={{ width: '300px', p: 2 }}>
      {selectedNode && (
        <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
          <IconButton onClick={handleBack}>
            <Icon icon={chevronLeft} />
          </IconButton>
          <Typography variant="h6">{selectedNode?.data?.title}</Typography>
        </Stack>
      )}
      {!selectedNode && <Menu />}
      {selectedNode && <EditForm />}
    </Box>
  );
}
export default Sidebar;
