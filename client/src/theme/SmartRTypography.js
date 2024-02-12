// ----------------------------------------------------------------------

export function pxToRem(value) {
  return `${value / 16}rem`;
}

function responsiveFontSizes({ sm, md, lg }) {
  return {
    '@media (max-width:1280px)': {
      fontSize: pxToRem(lg),
    },
    '@media (max-width:960px)': {
      fontSize: pxToRem(md),
    },
    '@media (max-width:600px)': {
      fontSize: pxToRem(sm),
    },
  };
}

const FONT_PRIMARY = `'Poppins', sans-serif !important`;

const typography = {
  fontFamily: FONT_PRIMARY,
  fontWeightLight: 300,
  fontWeightNormal: 400,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  h1: {
    fontWeight: 300,
    lineHeight: 142 / 96,
    fontSize: pxToRem(96),
    ...responsiveFontSizes({ sm: 56, md: 76, lg: 86 }),
  },
  h2: {
    fontWeight: 300,
    lineHeight: 88 / 64,
    fontSize: pxToRem(60),
    ...responsiveFontSizes({ sm: 38, md: 50, lg: 54 }),
  },
  h3: {
    fontWeight: 400,
    lineHeight: 72 / 48,
    fontSize: pxToRem(48),
    ...responsiveFontSizes({ sm: 32, md: 41.1, lg: 44.5 }),
  },
  h4: {
    fontWeight: 400,
    lineHeight: 42 / 34,
    fontSize: pxToRem(32),
    ...responsiveFontSizes({ sm: 25, md: 29, lg: 32 }),
  },
  h5: {
    fontWeight: 400,
    lineHeight: 36 / 24,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 20, md: 21, lg: 24 }),
  },
  h6: {
    fontWeight: 500,
    lineHeight: 30 / 20,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ sm: 20, md: 20, lg: 20 }),
  },
  subtitle1: {
    fontWeight: 400,
    lineHeight: 24 / 16,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 500,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  body1: {
    fontWeight: 400,
    lineHeight: 24 / 16,
    fontSize: pxToRem(16),
  },
  body2: {
    fontWeight: 400,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
  },
  caption: {
    fontWeight: 400,
    lineHeight: 18 / 12,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 400,
    lineHeight: 14 / 10,
    fontSize: pxToRem(10),
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 500,
    lineHeight: 22 / 14,
    fontSize: pxToRem(14),
    textTransform: 'uppercase',
  },
};

export default typography;
