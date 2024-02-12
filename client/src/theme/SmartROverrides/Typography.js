// ----------------------------------------------------------------------

export default function Typography(theme) {
  return {
    MuiTypography: {
      styleOverrides: {
        paragraph: {
          marginBottom: theme && theme.spacing && theme.spacing(2),
        },
        gutterBottom: {
          marginBottom: theme && theme.spacing && theme.spacing(1),
        },
      },
    },
  };
}
