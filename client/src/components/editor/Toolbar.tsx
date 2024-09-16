import {
  Badge,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';
import { Workflow } from 'models/Workflow';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@material-ui/lab';
import { isEqual, set } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { axiosInstance } from '@/utils/axios';
import { useFlow } from '@/store/flow';
import Theme from '@/theme/Theme';
import ProcessLogTable from '../log/ProcessLogTable';
import { setHistory } from '@/services/dexie';
import { useHistory } from '@/store/history';

type Props = {
  refetch: () => void;
};
function Toolbar({ refetch }: Props) {
  const { uuid, name, description, table, nodes, edges, flows, latestFlow } =
    useFlow();
  const { addHistoryId } = useHistory();
  const navigate = useNavigate();
  const [isDiff, setIsDiff] = useState<boolean>(false);

  const handleSave = async () => {
    try {
      if (uuid) {
        const historyId = await setHistory({
          id: uuidv4(),
          uuid,
          name,
          description,
          nodes,
          edges,
        });
        if (historyId) {
          addHistoryId(historyId);
        }
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

  useEffect(() => {
    if (!isEqual(flows, latestFlow)) {
      setIsDiff(true);
    } else {
      setIsDiff(false);
    }
  }, [flows]);
  return (
    <Theme>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          position: 'absolute',
          top: 10,
          zIndex: 1000,
          width: 'inherit',
          p: 2,
        }}
        justifyContent="space-between"
      >
        <LogButton uuid={uuid} />
        <Stack direction="row" spacing={2}>
          <Badge
            color="warning"
            variant="dot"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            invisible={!isDiff}
          >
            <Button
              startIcon={<Icon icon="mdi:content-save-outline" />}
              onClick={handleSave}
              variant="contained"
            >
              Save
            </Button>
          </Badge>
          <MoreButton />
        </Stack>
      </Stack>
    </Theme>
  );
}
function MoreButton() {
  const { uuid, name, description, table, nodes, edges, flows } = useFlow();
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
function LogButton({ uuid }: { uuid: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDialog = () => setIsOpen((pre) => !pre);
  return (
    <Box>
      <Button
        startIcon={<Icon icon="icon-park-outline:log" />}
        sx={{ height: 'inherit' }}
        variant="contained"
        onClick={toggleDialog}
      >
        Logs
      </Button>
      <Dialog fullWidth maxWidth="md" open={isOpen}>
        <DialogTitle>Logs</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={toggleDialog}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Icon icon="mdi:close" />
        </IconButton>
        <DialogContent>
          <ProcessLogTable uuid={uuid} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default Toolbar;
