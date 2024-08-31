import { alpha } from '@material-ui/core/styles';
import * as darkMode from './dark';
// ----------------------------------------------------------------------

function createGradient(color1, color2) {
  return `linear-gradient(to bottom, ${color1}, ${color2})`;
}

const LIGHT_MODE = {
  light: '#FFFFFF',
  main: '#F9FAFB',
  dark: '#F4F6F8',
  darker: '#DFE3E8',
  darkest: '#C4CDD5',
};
const palette = {
  darkMode,
};

export default palette;
