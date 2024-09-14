const background = {
  darkest: '#0b101a',
  darker: '#161b26',
  dark: '#1f2532',
  main: '#364054',
  light: '#2d3545',
};

const border = {
  light: '#3f4a5f',
  main: '#283040',
  secondary: '#283040',
  inverted: '#3f4a5f',
  success: '#aad19b',
  focused: '#2d78a4',
  nodeSelected: 'rgb(73, 189, 254)',
};

const anchor = {
  light: '#6bb3dc',
  main: '#3a95c9',
  purpleColor: '#999',
  purpleHoverColor: '#f3f3f3',
  lightBlueColor: '#a3c5eb',
};

const form = {
  fieldBackgroundColor: '#2d3545',
  fieldDisabledBackgroundColor: '#1f2532',
  fieldNoteBackgroundColor: '#2d3545',
  fieldReadOnlyBackgroundColor: '#1f2532',
  helpMessageBackground: '#0000',
  helpSuccessBackgroundColor: '#0000',
  helpWarningBackgroundColor: '#0000',
  helpPraiseBackground: '#0000',
  helpReferralBackground: '#0000',
  helpTrainingBackground: '#0000',
};

const warning = {
  dark: '#ccba45',
  main: '#e6d566',
  light: '#fdfcf2',
};

// eslint-disable-next-line prettier/prettier
interface IPalette {
  background: typeof background;
  border: typeof border;
  anchor: typeof anchor;
  form: typeof form;
  warning: typeof warning;
}
export type { IPalette };
export { background, border, anchor, form, warning };
