import { Icon } from '@iconify/react';
import earthIcon from '@iconify/icons-mdi/earth';
import playIcon from '@iconify/icons-mdi/play';
import dotsHorizontal from '@iconify/icons-mdi/dots-horizontal';
import pencilOutline from '@iconify/icons-mdi/pencil-outline';
import checkboxMultipleBlankOutline from '@iconify/icons-mdi/checkbox-multiple-blank-outline';
import trayArrowDown from '@iconify/icons-mdi/tray-arrow-down';
import deleteOutline from '@iconify/icons-mdi/delete-outline';

import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Workflow } from 'models/Workflow';
import { enqueueSnackbar } from 'notistack';
import { ClickEvent, InputEvent } from 'models/Event';
import { axiosInstance } from '@/utils/axios';
import CustomDialog from '../common/CustomDialog';
import FieldTitle from '../common/FieldTitle';
import CustomTextField from '../common/CustomTextField';

type Props = {
  workflow: Workflow;
  refetch: () => void;
};

const StyledWorkflowItem = styled(Card)(({ theme }) => ({
  background: theme.palette.background.darker,
  boxSizing: 'border-box',
  [`&:hover`]: {
    border: `1px solid ${theme.palette.border.main}`,
  },
}));

function WorkflowItem({ workflow, refetch }: Props) {
  return (
    <Grid
      item
      lg={3}
      md={4}
      sm={6}
      xs={12}
      sx={{ height: 'auto', '& a': { textDecoration: 'none' } }}
    >
      <Link to={`/workflows/${workflow?.uuid}`}>
        <StyledWorkflowItem sx={{ height: '100%', cursor: 'pointer' }}>
          <CardHeader
            title={
              <Stack direction="row" spacing={1} alignItems="center">
                <Icon icon={earthIcon} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, textDecoration: 'none' }}
                >
                  {workflow?.name}
                </Typography>
              </Stack>
            }
            action={<MoreMenu workflow={workflow} refetch={refetch} />}
          />
          <CardContent>
            <Box
              sx={{
                width: '100%',
                p: 1,
              }}
            >
              <Typography variant="body1">{workflow?.description}</Typography>
            </Box>
          </CardContent>
        </StyledWorkflowItem>
      </Link>
    </Grid>
  );
}
function MoreMenu({
  workflow,
  refetch,
}: {
  workflow: Workflow;
  refetch: () => void;
}) {
  const [isOpenConfirmDelete, setIsOpenConfirmDelete] = useState(false);
  const [isOpenDuplicate, setIsOpenDuplicate] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toggleConfirmDelete = (e: ClickEvent) => {
    e.stopPropagation();
    setIsOpenConfirmDelete((pre) => !pre);
  };
  const toggleDuplicate = (e: ClickEvent) => {
    e.stopPropagation();
    setIsOpenDuplicate((pre) => !pre);
  };
  const handleExport = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/workflows/${workflow?.uuid}/export`,
        {
          responseType: 'blob',
        }
      );
      console.log('🚀 ===== handleExport ===== response:', response);
      // // Create a URL for the blob and initiate download
      const url = window.URL.createObjectURL(response?.data);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${workflow?.name}.json`; // Replace with the desired filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      enqueueSnackbar('Export failed', {
        variant: 'error',
      });
    }
  };
  const handleDelete = async (e: ClickEvent) => {
    e.stopPropagation();
    try {
      const response = await axiosInstance.delete(
        `/api/workflows/${workflow?.uuid}`
      );
      if (response) {
        enqueueSnackbar('Delete successfully', {
          variant: 'success',
        });
        toggleConfirmDelete(e);
        refetch();
      }
    } catch (error) {
      console.log('🚀 ===== handleDelete ===== error:', error);
      enqueueSnackbar('Delete failed', {
        variant: 'error',
      });
    }
  };
  return (
    <>
      <Box onClick={(e) => e.preventDefault()}>
        <IconButton onClick={handleClick}>
          <Icon icon={dotsHorizontal} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={toggleDuplicate}>
            <ListItemIcon>
              <Icon icon={checkboxMultipleBlankOutline} />
            </ListItemIcon>
            <ListItemText>Duplicate</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleExport}>
            <ListItemIcon>
              <Icon icon={trayArrowDown} />
            </ListItemIcon>
            <ListItemText>Export</ListItemText>
          </MenuItem>
          <MenuItem onClick={toggleConfirmDelete}>
            <ListItemIcon>
              <Icon style={{ color: 'red' }} icon={deleteOutline} />
            </ListItemIcon>
            <ListItemText sx={{ color: 'red' }}>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
      <CustomDialog
        open={isOpenConfirmDelete}
        title="Delete workflow"
        description="Are you sure you want to delete this workflow?"
        handleConfirm={handleDelete}
        handleCancel={toggleConfirmDelete}
      />
      <DialogDuplicate
        open={isOpenDuplicate}
        handleCancel={toggleDuplicate}
        workflow={workflow}
      />
    </>
  );
}
type DialogDuplicateProps = {
  open: boolean;
  handleCancel: (e: ClickEvent) => void;
  workflow: Workflow;
};
function DialogDuplicate({
  open,
  handleCancel,
  workflow,
}: DialogDuplicateProps) {
  const [name, setName] = useState(`${workflow?.name} copy`);
  const navigate = useNavigate();
  const handleChangeName = (e: any) => {
    const value = e?.target?.value;
    setName(value);
  };
  const handleDuplicate = async (e: ClickEvent) => {
    e.stopPropagation();
    try {
      const response = await axiosInstance.post(
        `/api/workflows/${workflow?.uuid}/duplicate`,
        {
          name,
        }
      );
      if (response) {
        return navigate(`/workflows/${response?.data?.uuid}`);
      }
    } catch (error) {
      console.log('🚀 ===== handleDuplicate ===== error:', error);
    }
    return true;
  };
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onBackdropClick={(e) => e.stopPropagation()}
      open={open}
    >
      <DialogTitle>Duplicate workflow</DialogTitle>
      <DialogContent>
        <FieldTitle title="Name" />
        <CustomTextField
          onClick={(e: ClickEvent) => e.stopPropagation()}
          onChange={handleChangeName}
          value={name}
        />
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleDuplicate}>
            Confirm
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
export default WorkflowItem;
