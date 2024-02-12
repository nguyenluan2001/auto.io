import { alpha } from '@material-ui/core/styles';

// ----------------------------------------------------------------------

function createGradient(color1, color2) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

// SETUP COLORS
const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#333333',
  900: '#161C24',
  500_8: alpha('#919EAB', 0.08),
  500_12: alpha('#919EAB', 0.12),
  500_16: alpha('#919EAB', 0.16),
  500_24: alpha('#919EAB', 0.24),
  500_32: alpha('#919EAB', 0.32),
  500_48: alpha('#919EAB', 0.48),
  500_56: alpha('#919EAB', 0.56),
  500_80: alpha('#919EAB', 0.8),
};

const PRIMARY = {
  lighter: '#C8FACD',
  light: '#9fe4ff',
  main: '#5ac5ff',
  medium: '#B2E6FA',
  mediumDark: '#3FC0F3',
  mainColor: '#6DCFF6',
  dark: '#6dcff6',
  darker: '#005249',
  darkest: '#075573',
  contrastText: '#fff',
  yellow: '#F8DB2F',
  red: '#D2412F',
  orange: '#F7873F',
  black: '#465668',
  disabledMediumLightBG: '#D8F3FD',
  background: 'rgba(238,238,238,0.5)',
};
const SECONDARY = {
  lighter: '#D6E4FF',
  light: '#84A9FF',
  main: '#3366FF',
  dark: '#1939B7',
  darker: '#091A7A',
  contrastText: '#fff',
};
const INFO = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  darker: '#04297A',
  contrastText: '#fff',
};
const SUCCESS = {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D',
  contrastText: GREY[800],
};
const WARNING = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  darker: '#7A4F01',
  contrastText: GREY[800],
};
const ERROR = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E',
  contrastText: '#fff',
};

const NEW_PRIMARY = {
  darkest: '#075573',
  darker: '#0B7FAD',
  dark: '#0FA9E6',
  mediumDark: '#3FC0F3',
  mainColor: '#6DCFF6',
  medium: '#6DCFF6',
  light: '#ECF9FE',
};

const NEW_SECONDARY = {
  darker: '#1F1F1F',
  heavyCap: '#3D3D3D',
  bodyText: '#5C5C5C',
  desText: '#7A7A7A',
  disable: '#999999',
  borderLine: '#B8B8B8',
  bgGrey: '#D6D6D6',
  bgLight: '#F5F5F5',
  pureWhite: '#FFFFFF',
};

const NEW_ERROR = {
  light: '#FDD9DA',
  main: '#FAB3B6',
  dark: '#F78D92',
  darker: '#F4666E',
  darkest: '#FF3B30',
};

const NEW_SUCCESS = {
  ligth: '#BDEFCA',
  main: '#9DE7AF',
  dark: '#7DDE95',
  darker: '#5DD57B',
  darkest: '#34C759',
};

const NEW_WARNING = {
  light: '#FFEFAD',
  main: '#FFE785',
  dark: '#FFDE5C',
  darker: '#FFD633',
  darkest: '#FFCC00',
};

const NEW_INFO = {
  light: '#ECF9FE',
  main: '#B2E6FA',
  dark: '#6DCFF6',
  darker: '#3FC0F3',
  darkest: '#0FA9E6',
};

const GRADIENTS = {
  primary: createGradient(PRIMARY.light, PRIMARY.main),
  info: createGradient(INFO.light, INFO.main),
  success: createGradient(SUCCESS.light, SUCCESS.main),
  warning: createGradient(WARNING.light, WARNING.main),
  error: createGradient(ERROR.light, ERROR.main),
};

const palette = {
  common: { black: '#000', white: '#fff' },
  primary: { ...PRIMARY },
  secondary: { ...SECONDARY },
  info: { ...INFO },
  success: { ...SUCCESS },
  warning: { ...WARNING },
  error: { ...ERROR },
  grey: GREY,
  gradients: GRADIENTS,
  divider: GREY[500_24],
  text: { primary: GREY[800], secondary: GREY[600], disabled: GREY[500] },
  background: { paper: '#fff', default: '#fff', neutral: GREY[200] },
  newPrimary: { ...NEW_PRIMARY },
  newSecondary: { ...NEW_SECONDARY },
  newError: { ...NEW_ERROR },
  newSuccess: { ...NEW_SUCCESS },
  newWarning: { ...NEW_WARNING },
  newInfo: { ...NEW_INFO },
  action: {
    active: GREY[600],
    hover: GREY[500_8],
    selected: GREY[500_16],
    disabled: GREY[500_80],
    disabledBackground: GREY[500_24],
    focus: GREY[500_24],
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export default palette;
