import { v4 as uuidv4 } from 'uuid';
import { Icon } from '@iconify/react';
import earthIcon from '@iconify/icons-mdi/earth';
import playCircle from '@iconify/icons-mdi/play-circle';
import alarmIcon from '@iconify/icons-mdi/alarm';
import cursorDefaultOutline from '@iconify/icons-mdi/cursor-default-outline';
import formTextbox from '@iconify/icons-mdi/form-textbox';
import formatText from '@iconify/icons-mdi/format-text';
import autorenewIcon from '@iconify/icons-mdi/autorenew';
import stopCircleOutline from '@iconify/icons-mdi/stop-circle-outline';
import repeatVariant from '@iconify/icons-mdi/repeat-variant';
import React from 'react';

type Params = {
  type: string;
  position: {
    x: number;
    y: number;
  };
};
const generateNode = ({ type, position }: Params) => {
  switch (type) {
    case 'trigger': {
      return {
        id: uuidv4(),
        data: {
          title: 'Trigger',
          key: 'trigger',
          description: '',
          selector: '',
          icon: React.createElement(Icon, { icon: playCircle }),
        },
        position,
        type: 'customNode',
      };
    }
    case 'delay': {
      return {
        id: uuidv4(),
        data: {
          title: 'Delay',
          key: 'delay',
          description: '',
          selector: '',
          icon: React.createElement(Icon, { icon: alarmIcon }),
        },
        position,
        type: 'customNode',
      };
    }
    case 'http-request': {
      return {
        id: uuidv4(),
        data: {
          title: 'HTTP Request',
          key: 'http-request',
          description: '',
          selector: '',
          icon: React.createElement(Icon, { icon: earthIcon }),
        },
        position,
        type: 'customNode',
      };
    }
    case 'event-click': {
      return {
        id: uuidv4(),
        data: {
          title: 'Click element',
          key: 'event-click',
          description: '',
          selector: '',
          icon: React.createElement(Icon, { icon: cursorDefaultOutline }),
        },
        position,
        type: 'customNode',
      };
    }
    case 'form': {
      return {
        id: uuidv4(),
        data: {
          title: 'Form',
          key: 'form',
          description: '',
          selector: '',
          value: '',
          icon: React.createElement(Icon, { icon: formTextbox }),
        },
        position,
        type: 'customNode',
      };
    }
    case 'new-tab': {
      return {
        id: uuidv4(),
        data: {
          title: 'New tab',
          key: 'new-tab',
          description: '',
          url: '',
          icon: React.createElement(Icon, { icon: earthIcon }),
        },
        position,
        type: 'customNode',
      };
    }
    case 'get-text': {
      return {
        id: uuidv4(),
        data: {
          title: 'Get Text',
          key: 'get-text',
          description: '',
          url: '',
          icon: React.createElement(Icon, { icon: formatText }),
        },
        position,
        type: 'customNode',
      };
    }
    case 'loop-data': {
      return {
        id: uuidv4(),
        data: {
          title: 'Loop data',
          key: 'loop-data',
          description: '',
          url: '',
          icon: React.createElement(Icon, { icon: autorenewIcon }),
        },
        position,
        type: 'customNode',
      };
    }
    case 'break-loop': {
      return {
        id: uuidv4(),
        data: {
          title: 'Break loop',
          key: 'break-loop',
          description: '',
          url: '',
          icon: React.createElement(Icon, { icon: stopCircleOutline }),
        },
        position,
        type: 'customNode',
      };
    }
    case 'repeat': {
      return {
        id: uuidv4(),
        data: {
          title: 'Repeat',
          key: 'repeat',
          description: '',
          url: '',
          icon: React.createElement(Icon, { icon: repeatVariant }),
          // numOfHandler: 2,
        },
        position,
        type: 'customNode',
      };
    }
    default: {
      return false;
    }
  }
};
export { generateNode };
