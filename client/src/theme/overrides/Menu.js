// ----------------------------------------------------------------------

const Menu = {
  MuiMenu: {
    styleOverrides: {
      paper: ({ theme }) => ({
        background: theme.palette.background.light,
      }),
      list: {
        padding: '8px',
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: '8px',
        '&:hover': {
          background: theme.palette.background.dark,
        },
      }),
    },
  },
};
export default Menu;
