import { v4 as uuidv4 } from 'uuid';
import { WIDGET_ICON } from './constant';

type Params = {
  type: string;
  position?: {
    x: number;
    y: number;
  } | null;
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
          icon: WIDGET_ICON.trigger,
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
          icon: WIDGET_ICON.delay,
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
          icon: WIDGET_ICON['http-request'],
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
          icon: WIDGET_ICON['event-click'],
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
          icon: WIDGET_ICON.form,
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
          icon: WIDGET_ICON['new-tab'],
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
          icon: WIDGET_ICON['get-text'],
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
          icon: WIDGET_ICON['loop-data'],
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
          icon: WIDGET_ICON['break-loop'],
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
          icon: WIDGET_ICON.repeat,
          // numOfHandler: 2,
        },
        position,
        type: 'customNode',
      };
    }
    case 'get-attribute': {
      return {
        id: uuidv4(),
        data: {
          title: 'Get Attribute',
          key: 'get-attribute',
          description: '',
          url: '',
          icon: WIDGET_ICON['get-attribute'],
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
