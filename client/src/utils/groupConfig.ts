import earthIcon from '@iconify/icons-mdi/earth';
import playCircle from '@iconify/icons-mdi/play-circle';
import alarmIcon from '@iconify/icons-mdi/alarm';
import cursorDefaultOutline from '@iconify/icons-mdi/cursor-default-outline';
import formTextbox from '@iconify/icons-mdi/form-textbox';
import formatText from '@iconify/icons-mdi/format-text';
import autorenewIcon from '@iconify/icons-mdi/autorenew';
import stopCircleOutline from '@iconify/icons-mdi/stop-circle-outline';
import repeatVariant from '@iconify/icons-mdi/repeat-variant';
import codeBrackets from '@iconify/icons-mdi/code-brackets';

import { Icon } from '@iconify/react';

const GROUPS = [
  {
    title: 'General',
    widgets: [
      {
        id: 1,
        title: 'Trigger',
        key: 'trigger',
        icon: playCircle,
      },
      {
        id: 2,
        title: 'Delay',
        key: 'delay',
        icon: alarmIcon,
      },
      {
        id: 3,
        title: 'HTTP Request',
        key: 'http-request',
        icon: earthIcon,
      },
    ],
  },
  {
    title: 'Browser',
    widgets: [
      {
        id: 1,
        title: 'New tab',
        key: 'new-tab',
        icon: earthIcon,
      },
    ],
  },
  {
    title: 'Web Interaction',
    widgets: [
      {
        id: 1,
        title: 'Click Element',
        key: 'event-click',
        icon: cursorDefaultOutline,
      },
      {
        id: 2,
        title: 'Form',
        key: 'form',
        icon: formTextbox,
      },
      {
        id: 3,
        title: 'Get Text',
        key: 'get-text',
        icon: formatText,
      },
      {
        id: 4,
        title: 'Get Attribute',
        key: 'get-attribute',
        icon: codeBrackets,
      },
    ],
  },
  {
    title: 'Control flow',
    widgets: [
      {
        id: 1,
        title: 'Loop data',
        key: 'loop-data',
        icon: autorenewIcon,
      },
      {
        id: 2,
        title: 'Break loop',
        key: 'break-loop',
        icon: stopCircleOutline,
      },
      {
        id: 2,
        title: 'Repeat',
        key: 'repeat',
        icon: repeatVariant,
      },
    ],
  },
];
export { GROUPS };
