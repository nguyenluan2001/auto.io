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
import React, { useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { Workflow } from 'models/Workflow';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';
import { set } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
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
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [processUUID, setProcessUUID] = useState('');
  const handleRun = async () => {
    try {
      setIsRunning(true);
      const process_uuid = uuidv4();
      setProcessUUID(process_uuid);
      const response = await axiosInstance.post(`/api/workflows/${uuid}/run`, {
        process_uuid,
      });
      console.log('🚀 ===== handleClick ===== response:', response);
      if (response.status === 200) {
        enqueueSnackbar('Run workflow successfully', {
          variant: 'success',
        });
        setIsRunning(false);
      }
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
        const response = await axiosInstance.put(`/api/workflows/${uuid}`, {
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
      const response = await axiosInstance.post('/api/workflows/create', {
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
      navigate(`/workflows/${response?.data?.uuid}`);
    } catch (error) {
      enqueueSnackbar('Save workflow failed', {
        variant: 'error',
      });
    }
  };

  const handleCancel = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/processes/${processUUID}/cancel`
      );
      setIsRunning(false);
      enqueueSnackbar('Cancel running workflow successfully', {
        variant: 'success',
      });
    } catch (error) {
      console.log('🚀 ===== handleCancel ===== error:', error);
      enqueueSnackbar('Cancel running workflow failed', {
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
        {isRunning && (
          <Button
            startIcon={<Icon icon="codicon:stop-circle" />}
            variant="contained"
            color="error"
            onClick={handleCancel}
          >
            Cancel
          </Button>
        )}
        <LoadingButton
          loading={isRunning}
          startIcon={<Icon icon="mdi:play" />}
          onClick={handleRun}
          variant="outlined"
          sx={{ bgcolor: 'neutral.pureWhite' }}
        >
          Run
        </LoadingButton>
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
      }),
    ]);
    const link = document.createElement('a');
    link.download = `${name}.json`;
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
