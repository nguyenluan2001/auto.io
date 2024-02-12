// material
import { CssBaseline } from '@mui/material';
import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from '@mui/material/styles';
import { useMemo } from 'react';
//
import breakpoints from './breakpoints';
import GlobalStyles from './globalStyles';
import componentsOverride from './SmartROverrides';
import palette from './SmartRPalette';
import shadows, { customShadows } from './shadows';
import shape from './shape';
import typography from './SmartRTypography';

// ----------------------------------------------------------------------

export default function ThemeConfig({ children }: { children: any }) {
  const themeOptions = useMemo(
    () => ({
      palette,
      shape,
      typography,
      breakpoints,
      shadows,
      customShadows,
      direction: 'ltr',
    }),
    []
  ) as any;

  const theme = createTheme(themeOptions);
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
