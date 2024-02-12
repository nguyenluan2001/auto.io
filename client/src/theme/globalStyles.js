import { withStyles } from '@material-ui/styles';
// import { NEXT_PUBLIC_CUSTOM_FONT } from 'utils/constants';
// ----------------------------------------------------------------------

const GlobalStyles = withStyles((theme, props) => {
  return {
    '@global': {
      '*': {
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
        // fontFamily:
        //   NEXT_PUBLIC_CUSTOM_FONT !== ''
        //     ? `'${NEXT_PUBLIC_CUSTOM_FONT}', sans-serif !important`
        //     : `'Poppins',Helvetica,Arial,Lucida,sans-serif`,
        fontFamily: `'Poppins',Helvetica,Arial,Lucida,sans-serif`,
      },
      html: {
        width: '100%',
        height: '100%',
        '-ms-text-size-adjust': '100%',
        '-webkit-overflow-scrolling': 'touch',
      },
      body: {
        width: '100%',
        height: '100%',
      },
      '#root': {
        width: '100%',
        height: '100%',
      },
      input: {
        '&[type=number]': {
          MozAppearance: 'textfield',
          '&::-webkit-outer-spin-button': {
            margin: 0,
            WebkitAppearance: 'none',
          },
          '&::-webkit-inner-spin-button': {
            margin: 0,
            WebkitAppearance: 'none',
          },
        },
      },
      // textarea: {
      //   '&::-webkit-input-placeholder': { color: theme.palette.text.disabled },
      //   '&::-moz-placeholder': {
      //     opacity: 1,
      //     color: theme.palette.text.disabled,
      //   },
      //   '&:-ms-input-placeholder': { color: theme.palette.text.disabled },
      //   '&::placeholder': { color: theme.palette.text.disabled },
      // },
      // a: { color: theme.palette.primary.main },
      img: { display: 'block', maxWidth: '100%' },
    },
  };
})(() => null);

export default GlobalStyles;
