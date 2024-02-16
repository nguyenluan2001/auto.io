import { WIDGET_ICON } from './constant';

const GROUPS = [
  {
    title: 'General',
    widgets: [
      {
        id: 1,
        title: 'Trigger',
        key: 'trigger',
        icon: WIDGET_ICON.trigger,
      },
      {
        id: 2,
        title: 'Delay',
        key: 'delay',
        icon: WIDGET_ICON.delay,
      },
      {
        id: 3,
        title: 'HTTP Request',
        key: 'http-request',
        icon: WIDGET_ICON['http-request'],
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
        icon: WIDGET_ICON['new-tab'],
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
        icon: WIDGET_ICON['event-click'],
      },
      {
        id: 2,
        title: 'Form',
        key: 'form',
        icon: WIDGET_ICON.form,
      },
      {
        id: 3,
        title: 'Get Text',
        key: 'get-text',
        icon: WIDGET_ICON['get-text'],
      },
      {
        id: 4,
        title: 'Get Attribute',
        key: 'get-attribute',
        icon: WIDGET_ICON['get-attribute'],
      },
      {
        id: 5,
        title: 'Scroll',
        key: 'scroll',
        icon: WIDGET_ICON.scroll,
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
        icon: WIDGET_ICON['loop-data'],
      },
      {
        id: 2,
        title: 'Break loop',
        key: 'break-loop',
        icon: WIDGET_ICON['break-loop'],
      },
      {
        id: 2,
        title: 'Repeat',
        key: 'repeat',
        icon: WIDGET_ICON.repeat,
      },
    ],
  },
];
export { GROUPS };
