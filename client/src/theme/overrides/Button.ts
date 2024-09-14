/* eslint-disable import/no-cycle */
import { backdropClasses } from '@mui/material';
import { ITheme } from '../Theme';

const Button = {
  MuiButton: {
    styleOverrides: {
      root: ({ theme }: { theme: ITheme }) => ({
        background: theme.palette.anchor.main,
        color: 'white',
        fontSize: '0.87rem',
        lineHeight: '1.25rem',
        fontWeight: 700,
        textTransform: 'none',
        height: '32px',
      }),
      outlined: ({ theme }: { theme: ITheme }) => ({
        background: 'white',
        border: `1px solid ${theme.palette.anchor.main}`,
        color: theme.palette.anchor.main,
        '&:hover': {
          background: 'white',
        },
      }),
      containedWarning: ({ theme }: { theme: ITheme }) => ({
        background: theme.palette.warning.main,
        color: theme.palette.background.main,
      }),
    },
  },
};
export default Button;
