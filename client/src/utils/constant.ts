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

export const {
  VITE_APP_SERVER_URL,
  VITE_APP_GOOGLE_CLIENT_ID,
  VITE_APP_GOOGLE_CLIENT_SECRET,
} = import.meta.env;
export const ROWS_PER_PAGE = 10;
export const WIDGET_ICON = {
  trigger: playCircle,
  delay: alarmIcon,
  'http-request': earthIcon,
  'event-click': cursorDefaultOutline,
  form: formTextbox,
  'new-tab': earthIcon,
  'get-text': formatText,
  'loop-data': autorenewIcon,
  'break-loop': stopCircleOutline,
  repeat: repeatVariant,
  'get-attribute': codeBrackets,
  scroll: 'fluent:phone-vertical-scroll-20-regular',
};
