/* eslint-disable import/no-cycle */
import { ITheme } from '../Theme';

const Autocomplete = {
  MuiAutocomplete: {
    styleOverrides: {
      inputRoot: ({ theme }: { theme: ITheme }) => ({
        paddingTop: '0px',
        paddingBottom: '0px',
      }),
    },
  },
};
export default Autocomplete;
