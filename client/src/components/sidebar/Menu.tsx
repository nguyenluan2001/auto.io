import earthIcon from '@iconify/icons-mdi/earth';
import playCircle from '@iconify/icons-mdi/play-circle';
import alarmIcon from '@iconify/icons-mdi/alarm';
import cursorDefaultOutline from '@iconify/icons-mdi/cursor-default-outline';
import formTextbox from '@iconify/icons-mdi/form-textbox';
import formatText from '@iconify/icons-mdi/format-text';
import autorenewIcon from '@iconify/icons-mdi/autorenew';
import stopCircleOutline from '@iconify/icons-mdi/stop-circle-outline';
import repeatVariant from '@iconify/icons-mdi/repeat-variant';

import { Icon } from '@iconify/react';

import { Box, Stack, TextField, Typography } from '@mui/material';
import SimpleBar from 'simplebar-react';
import Group from './Group';
import { CustomTextArea } from '../common/styled';
import { useFlow } from '@/store/flow';

// const widgets = [
//   {
//     id: 1,
//     title: 'Trigger',
//     icon: <Icon icon={playCircle} />,
//     type: 'General',
//   },
//   {
//     id: 2,
//     title: 'New tab',
//     icon: <Icon icon={earthIcon} />,
//     type: 'Browser',
//   },
// ];
const groups = {
  General: [
    {
      id: 1,
      title: 'Trigger',
      key: 'trigger',
      icon: <Icon icon={playCircle} />,
    },
    {
      id: 2,
      title: 'Delay',
      key: 'delay',
      icon: <Icon icon={alarmIcon} />,
    },
    {
      id: 3,
      title: 'HTTP Request',
      key: 'http-request',
      icon: <Icon icon={earthIcon} />,
    },
  ],
  Browser: [
    {
      id: 1,
      title: 'New tab',
      key: 'new-tab',
      icon: <Icon icon={earthIcon} />,
    },
  ],
  'Web Interaction': [
    {
      id: 1,
      title: 'Click Element',
      key: 'event-click',
      icon: <Icon icon={cursorDefaultOutline} />,
    },
    {
      id: 2,
      title: 'Form',
      key: 'form',
      icon: <Icon icon={formTextbox} />,
    },
    {
      id: 3,
      title: 'Get Text',
      key: 'get-text',
      icon: <Icon icon={formatText} />,
    },
  ],
  Control_flow: [
    {
      id: 1,
      title: 'Loop data',
      key: 'loop-data',
      icon: <Icon icon={autorenewIcon} />,
    },
    {
      id: 2,
      title: 'Break loop',
      key: 'break-loop',
      icon: <Icon icon={stopCircleOutline} />,
    },
    {
      id: 2,
      title: 'Repeat',
      key: 'repeat',
      icon: <Icon icon={repeatVariant} />,
    },
  ],
};

function Menu() {
  // const setName = useFlow((state: any) => state.setName);
  // const setDescription = useFlow((state: any) => state.setDescription);
  const { setName, setDescription, name, description } = useFlow(
    (state) => state
  ) as {
    setName: (value: string) => void;
    setDescription: (value: string) => void;
    name: string;
    description: string;
  };
  const handleChangeName = (value: string) => setName(value);
  const handleChangeDescription = (value: string) => setDescription(value);
  return (
    <Stack direction="column" spacing={2} sx={{ height: '100vh' }}>
      <Box>
        <Typography variant="body1">Workflow name</Typography>
        <TextField
          fullWidth
          value={name}
          onChange={(e) => handleChangeName(e.target.value)}
        />
      </Box>
      <Box>
        <Typography variant="body1">Description</Typography>
        <CustomTextArea
          minRows={5}
          value={description}
          onChange={(e) => handleChangeDescription(e.target.value)}
        />
      </Box>
      <SimpleBar
        style={
          {
            flex: 1,
            '& .simplebar-content': {
              height: '100%',
              // display: 'flex',
              // flexDirection: 'column',
            },
          } as React.CSSProperties
        }
      >
        {Object.entries(groups)?.map(([label, widgets], index) => (
          <Group key={index} label={label} widgets={widgets} />
        ))}
      </SimpleBar>
    </Stack>
  );
}

export default Menu;
