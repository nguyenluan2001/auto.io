// ----------------------------------------------------------------------

export default function Tabs(theme) {
  return {
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #ddd',
        },
        indicator: {
          backgroundColor: theme.palette.text.primary,
          minWidth: 50,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: 0,
          flexDirection: 'row',
          fontWeight: theme.typography.fontWeightMedium,
          borderTopLeftRadius: theme.shape.borderRadius,
          borderTopRightRadius: theme.shape.borderRadius,
          '*:first-of-type': {
            marginBottom: 0,
            marginRight: '6px',
          },
          '&.Mui-selected': {
            color: theme.palette.text.primary,
          },
          '&:not(:last-child)': {
            marginRight: theme.spacing(5),
          },
          '@media (min-width: 600px)': {
            minWidth: 48,
          },
        },
        labelIcon: {
          minHeight: 48,
          paddingTop: 0,
          '& > .MuiTab-wrapper > *:first-of-type': {
            marginBottom: 0,
            marginRight: theme.spacing(1),
          },
        },
        wrapper: {
          flexDirection: 'row',
          whiteSpace: 'nowrap',
        },
        textColorInherit: {
          opacity: 1,
          color: theme.palette.text.secondary,
        },
      },
    },
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiTabScrollButton: {
      styleOverrides: {
        root: {
          width: 48,
          borderRadius: '50%',
        },
      },
    },
  };
}
