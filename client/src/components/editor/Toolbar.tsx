import { Box, Button, Stack } from '@mui/material';
import React from 'react';
import { enqueueSnackbar } from 'notistack';
import { axiosInstance } from '@/utils/axios';
import { useFlow } from '@/store/flow';

function Toolbar({ refetch }) {
  // const flows = useFlow((state: any) => state.flows);
  const { uuid, name, description, nodes, edges, flows } = useFlow(
    (state) => state
  );
  const handleRun = async () => {
    const response = await axiosInstance.post('/run', flows);
    console.log('🚀 ===== handleClick ===== response:', response);
  };
  const handleSave = async () => {
    try {
      if (uuid) {
        const response = await axiosInstance.put(`/workflow/${uuid}`, {
          name,
          description,
          config: { nodes, edges },
        });
        enqueueSnackbar('Save workflow successfully', {
          variant: 'success',
        });
        refetch();
        return;
      }
      const response = await axiosInstance.post('/create', {
        name,
        description,
        config: { nodes, edges },
      });
      enqueueSnackbar('Save workflow successfully', {
        variant: 'success',
      });
      console.log('🚀 ===== handleSave ===== response:', response);
    } catch (error) {}
    enqueueSnackbar('Save workflow failed', {
      variant: 'error',
    });
  };
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 1000,
      }}
    >
      <Button onClick={handleRun} variant="contained">
        Run
      </Button>
      <Button onClick={handleSave} variant="contained">
        Save
      </Button>
    </Stack>
  );
}

export default Toolbar;
