import chevronLeft from '@iconify/icons-mdi/chevron-left';
import { Icon } from '@iconify/react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { useFlow } from '@/store/flow';
import EditWidgetForm from './EditWidgetForm';
import EditWorkflowForm from './EditWorkflowForm';

function Sidebar() {
  const selectedNode = useFlow((state: any) => state.selectedNode);
  const setSelectedNode = useFlow((state: any) => state.setSelectedNode);
  const handleBack = () => setSelectedNode(null);
  return (
    <Stack direction="row" sx={{ height: '100vh' }}>
      <Box sx={{ width: '300px', p: 2 }}>
        {selectedNode && (
          <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
            <IconButton onClick={handleBack}>
              <Icon icon={chevronLeft} />
            </IconButton>
            <Typography variant="h6">{selectedNode?.data?.title}</Typography>
          </Stack>
        )}
        <Icon
          style={{
            position: 'absolute',
            zIndex: 100000,
            top: 10,
            right: 10,
          }}
          onClick={() => alert(123)}
          icon={chevronLeft}
        />
        {!selectedNode && <EditWorkflowForm />}
        {selectedNode && <EditWidgetForm />}
      </Box>
    </Stack>
  );
}
export default Sidebar;
