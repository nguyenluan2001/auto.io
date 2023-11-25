import earthIcon from '@iconify/icons-mdi/earth';
import playCircle from '@iconify/icons-mdi/play-circle';
import alarmIcon from '@iconify/icons-mdi/alarm';
import cursorDefaultOutline from '@iconify/icons-mdi/cursor-default-outline';
import formTextbox from '@iconify/icons-mdi/form-textbox';
import formatText from '@iconify/icons-mdi/format-text';
import autorenewIcon from '@iconify/icons-mdi/autorenew';
import stopCircleOutline from '@iconify/icons-mdi/stop-circle-outline';

import { Icon } from '@iconify/react';

import { Box } from '@mui/material';
import Group from './Group';

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
      id: 1,
      title: 'Break loop',
      key: 'break-loop',
      icon: <Icon icon={stopCircleOutline} />,
    },
  ],
};

function Menu() {
  return (
    <Box>
      {Object.entries(groups)?.map(([label, widgets]) => (
        <Group label={label} widgets={widgets} />
      ))}
    </Box>
  );
}

export default Menu;
