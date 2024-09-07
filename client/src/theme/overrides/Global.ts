/* eslint-disable import/no-cycle */
import { ITheme } from '../Theme';

const Global = {
  Mui: {
    styleOverrides: {
      focused: ({ theme }: { theme: ITheme }) => ({
        // eslint-disable-next-line prettier/prettier
        border: `1px solid ${theme.palette.border.focused}`,
      }),
    },
  },
};
export default Global;
