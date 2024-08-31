import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { Icon } from '@iconify/react';
import plusIcon from '@iconify/icons-mdi/plus';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import Auth from '@/HOCs/Auth';
import { useWorkflows } from '@/hooks/useWorkflows';
import { WorkflowList } from '../components/homepage/WorkflowList';
import LoadingScreen from '@/components/common/LoadingScreen';
import FieldTitle from '@/components/common/FieldTitle';
import CustomTextField from '@/components/common/CustomTextField';
import UploadFile from '@/components/common/UploadFile';
import { axiosInstance } from '@/utils/axios';
import Theme from '@/theme/Theme';
import ButtonGroup from '@/components/common/button/ButtonGroup';

const StyledWrapper = styled(Container)(({ theme }) => ({
  background: theme.palette.background.darkest,
}));

function Workflow() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const { data, isLoading, refetch } = useWorkflows();
  const navigate = useNavigate();
  const onClickCreate = () => {
    navigate('/create');
  };
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const toggleDialog = () => setIsOpenDialog((pre) => !pre);
  const onClickImport = () => {
    toggleDialog();
  };
  if (isLoading) return <LoadingScreen />;
  return (
    <Theme>
      <StyledWrapper maxWidth="xl" sx={{ py: 5 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h4">Workflows</Typography>
          <ButtonGroup
            title="Create Workflow"
            onClickCreate={onClickCreate}
            onClickDropdown={handleClick}
          />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={onClickImport}>
              <ListItemIcon>
                <Icon icon="mdi:tray-upload" />
              </ListItemIcon>
              <ListItemText>Import workflow</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>
        <Stack>
          <WorkflowList workflows={data} refetch={refetch} />
        </Stack>
        <DialogImportWorkflow open={isOpenDialog} onClose={toggleDialog} />
      </StyledWrapper>
    </Theme>
  );
}
type DialogProps = {
  open: boolean;
  onClose: () => void;
};
const DEFAULT_VALUES = {
  name: '',
  workflow: null,
};
function DialogImportWorkflow({ open, onClose }: DialogProps) {
  const navigate = useNavigate();
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: DEFAULT_VALUES,
  });
  const onUploadFile = async (file: File) => {
    const reader = new FileReader();

    // await reader.readAsDataURL(file)

    reader.readAsText(file);

    reader.onload = async (e: any) => {
      const content = await JSON.parse(e?.target?.result);
      setValue('workflow', content);
    };
  };
  const onSubmit = async (values: any) => {
    try {
      const response = await axiosInstance.post('/workflows/create', {
        name: values?.name,
        nodes: values?.workflow?.nodes,
        edges: values?.workflow?.edges,
        // config: { nodes, edges },
      });
      if (response) {
        enqueueSnackbar('Import workflow successfully', {
          variant: 'success',
        });
        navigate(`/workflows/${response?.data?.uuid}`);
      }
    } catch (error) {
      enqueueSnackbar('Import workflow failed', {
        variant: 'error',
      });
    }
    console.log('🚀 ===== onSubmit ===== values:', values);
  };
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <IconButton
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
        }}
        onClick={onClose}
      >
        <Icon icon="mdi:close" />
      </IconButton>
      <DialogContent>
        <Stack direction="column" spacing={2}>
          <Box>
            <FieldTitle title="Workflow name" />
            <Controller
              control={control}
              name="name"
              render={({ field }) => <CustomTextField fullWidth {...field} />}
            />
          </Box>
          <Box>
            <FieldTitle title="Upload workflow" />
            <UploadFile onChange={onUploadFile} />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          sx={{ width: '100%' }}
        >
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)}>
            Create
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}

export default Workflow;
