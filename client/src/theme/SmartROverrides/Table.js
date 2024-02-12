// ----------------------------------------------------------------------

export default function Table(theme) {
  const isRTL = theme?.direction === 'rtl';
  const thLeft = {
    paddingLeft: 24,
    borderTopLeftRadius: theme.shape.borderRadius,
    borderBottomLeftRadius: theme.shape.borderRadius,
    boxShadow: `inset 8px 0 0 ${theme.palette.background.paper}`,
  };
  const thRight = {
    paddingRight: 24,
    borderTopRightRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius,
    boxShadow: `inset -8px 0 0 ${theme.palette.background.paper}`,
  };

  return {
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: theme.palette.action.selected,
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          },
          '&:nth-of-type(even)': {
            backgroundColor: theme.palette.neutral.bgLight,
            color: theme.palette.neutral.heavyCap,
          },
          // hide last border
          '&:last-child td, &:last-child th': {
            border: 0,
          },
          '&:hover': {
            backgroundColor: theme.palette.primary.medium,
          },
          height: 56,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
          boxShadow: 'none',
        },
        head: {
          backgroundColor: theme.palette.neutral.heavyCap,
          color: theme.palette.neutral.pureWhite,
          boxShadow: 'none',
          borderRadius: 0,
          height: '10px',
        },
        stickyHeader: {
          backgroundColor: theme.palette.background.paper,
          backgroundImage: `linear-gradient(to bottom, ${theme.palette.background.neutral} 0%, ${theme.palette.background.neutral} 100%)`,
        },
        body: {
          '&:first-of-type': {},
          '&:last-of-type': {},
          fontSize: 14,
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          borderTop: `solid 1px ${theme.palette.divider}`,
        },
        toolbar: {
          height: 64,
        },
        select: {
          '&:focus': {
            borderRadius: theme.shape.borderRadius,
          },
        },
        selectIcon: {
          width: 20,
          height: 20,
          marginTop: 2,
        },
      },
    },
  };
}
