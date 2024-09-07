/* eslint-disable import/no-cycle */
import { border, type IPalette } from '../palette/dark';
import { ITheme } from '../Theme';

const TextField = {
  MuiInputBase: {
    styleOverrides: {
      root: ({ theme }: { theme: ITheme }) => ({
        // eslint-disable-next-line prettier/prettier
        background: (theme.palette as any as IPalette).form.fieldBackgroundColor,
        borderRadius: 'unset!important',
        border: `1px solid ${theme.palette.border.inverted}`,
        '&.Mui-focused fieldset': {
          border: `1px solid ${theme.palette.border.focused}!important`,
        },
      }),
      input: {
        padding: '8px 14px!important',
      },
    },
  },
};
export default TextField;
