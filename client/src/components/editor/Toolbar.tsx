import { Box, Button, Stack } from '@mui/material';
import React from 'react';
import { enqueueSnackbar } from 'notistack';
import { Workflow } from 'models/Workflow';
import { axiosInstance } from '@/utils/axios';
import { useFlow } from '@/store/flow';

type Props = {
  refetch: () => void;
};
function Toolbar({ refetch }: Props) {
  // const flows = useFlow((state: any) => state.flows);
  const { uuid, name, description, table, nodes, edges, flows } = useFlow(
    (state) => state
  ) as Workflow;
  const handleRun = async () => {
    try {
      const response = await axiosInstance.post(
        `/workflows/${uuid}/run`,
        flows
      );
      console.log('🚀 ===== handleClick ===== response:', response);
      enqueueSnackbar('Run workflow successfully', {
        variant: 'success',
      });
    } catch (error) {
      console.log('🚀 ===== handleRun ===== error:', error);
      enqueueSnackbar('Run workflow fail', {
        variant: 'error',
      });
    }
  };
  const handleSave = async () => {
    try {
      if (uuid) {
        const response = await axiosInstance.put(`/workflows/${uuid}`, {
          name,
          description,
          tableId: table?.id,
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
        tableId: table?.id,
        config: { nodes, edges },
      });
      enqueueSnackbar('Save workflow successfully', {
        variant: 'success',
      });
      console.log('🚀 ===== handleSave ===== response:', response);
    } catch (error) {
      enqueueSnackbar('Save workflow failed', {
        variant: 'error',
      });
    }
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
