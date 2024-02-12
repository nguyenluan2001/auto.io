import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
} from '@mui/material';
import React from 'react';
import { enqueueSnackbar } from 'notistack';
import { Workflow } from 'models/Workflow';
import { Icon } from '@iconify/react';
import { axiosInstance } from '@/utils/axios';
import { useFlow } from '@/store/flow';
import Theme from '@/theme/Theme';

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
          nodes,
          edges,
          config: { nodes, edges },
        });
        enqueueSnackbar('Save workflow successfully', {
          variant: 'success',
        });
        refetch();
        return;
      }
      const response = await axiosInstance.post('/workflows/create', {
        name,
        description,
        tableId: table?.id,
        nodes,
        edges,
        // config: { nodes, edges },
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
    <Theme>
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
        <Button
          startIcon={<Icon icon="mdi:play" />}
          onClick={handleRun}
          variant="outlined"
          sx={{ bgcolor: 'neutral.pureWhite' }}
        >
          Run
        </Button>
        <Button
          startIcon={<Icon icon="mdi:content-save-outline" />}
          onClick={handleSave}
          variant="contained"
        >
          Save
        </Button>
        <MoreButton />
      </Stack>
    </Theme>
  );
}
function MoreButton() {
  const { uuid, name, description, table, nodes, edges, flows } = useFlow(
    (state) => state
  ) as Workflow;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleExport = async () => {
    const blob = new Blob([
      JSON.stringify({
        nodes,
        edges,
        flows,
      }),
    ]);
    const link = document.createElement('a');
    link.download = 'workflow.json';
    link.href = window.URL.createObjectURL(blob);
    link.click();
  };
  return (
    <>
      <IconButton onClick={handleClick}>
        <Icon icon="mdi:more-circle-outline" />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleExport}>
          <ListItemIcon>
            <Icon icon="mdi:tray-arrow-down" />
          </ListItemIcon>
          <ListItemText>Export</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

export default Toolbar;
