import { Box, Button, Stack, styled, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { v4 as uuidv4 } from 'uuid';
import { enqueueSnackbar } from 'notistack';
import { ControlButton, useReactFlow } from 'reactflow';
import ThemeConfig, { ITheme } from '@/theme/Theme';
import { axiosInstance } from '@/utils/axios';
import { useFlow } from '@/store/flow';

const RootStyle = styled(Stack)(({ theme }: { theme?: ITheme }) => ({
  position: 'absolute',
  bottom: 8,
  left: 0,
  right: 0,
  justifyContent: 'center',
  height: '50px',
  '& > .MuiStack-root': {
    height: '42px',
    background: theme?.palette.background.main,
    borderRadius: '4px',
    alignItems: 'center',
    padding: '0 4px',
    gap: '4px',
  },
}));

const ActionIconStyle = styled(Stack)(({ theme }: { theme?: ITheme }) => ({
  height: '32px',
  width: '32px',
  borderRadius: '4px',
  cursor: 'pointer',
  '&:hover': {
    background: theme?.palette.background.light,
  },
}));

function BottomToolbar() {
  const [isRunning, setIsRunning] = useState(false);
  const [processUUID, setProcessUUID] = useState('');
  const { uuid } = useFlow();
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const actions = [
    {
      icon: 'material-symbols-light:undo',
      tooltip: 'Undo',
      handler: () => {},
    },
    {
      icon: 'material-symbols-light:redo',
      tooltip: 'Redo',
      handler: () => {},
    },
    {
      icon: 'material-symbols-light:zoom-in-rounded',
      tooltip: 'Zoom in',
      handler: () => zoomIn(),
    },
    {
      icon: 'material-symbols-light:zoom-out-rounded',
      tooltip: 'Zoom out',
      handler: () => zoomOut(),
    },
    {
      icon: 'material-symbols-light:expand-content-rounded',
      tooltip: 'Fit view',
      handler: () => fitView(),
    },
  ];

  const handleRun = async () => {
    try {
      setIsRunning(true);
      const process_uuid = uuidv4();
      setProcessUUID(process_uuid);
      const response = await axiosInstance.post(`/api/workflows/${uuid}/run`, {
        process_uuid,
      });
      if (response.status === 200) {
        enqueueSnackbar('Run workflow successfully', {
          variant: 'success',
        });
        setIsRunning(false);
      }
    } catch (error) {
      enqueueSnackbar('Run workflow fail', {
        variant: 'error',
      });
    }
  };

  const handleStop = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/processes/${processUUID}/cancel`
      );
      setIsRunning(false);
      enqueueSnackbar('Cancel running workflow successfully', {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar('Cancel running workflow failed', {
        variant: 'error',
      });
    }
  };
  return (
    <ThemeConfig>
      <RootStyle direction="row">
        <Stack direction="row">
          {actions?.map((action, index) => (
            <Tooltip key={index} title={action.tooltip}>
              <ActionIconStyle
                alignItems="center"
                justifyContent="center"
                onClick={action.handler}
              >
                <Icon style={{ fontSize: 20 }} icon={action.icon} />
              </ActionIconStyle>
            </Tooltip>
          ))}
          <Tooltip
            title={
              isRunning ? 'Stop the running flow' : 'Start running the flow'
            }
          >
            <Button
              endIcon={
                isRunning ? (
                  <Icon icon="material-symbols-light:stop-circle-outline" />
                ) : (
                  <Icon icon="material-symbols-light:smart-display-outline-sharp" />
                )
              }
              variant="contained"
              onClick={isRunning ? handleStop : handleRun}
              color={isRunning ? 'warning' : 'primary'}
            >
              {isRunning ? 'Stop' : 'Run'}
            </Button>
          </Tooltip>
        </Stack>
      </RootStyle>
    </ThemeConfig>
  );
}

export default BottomToolbar;
