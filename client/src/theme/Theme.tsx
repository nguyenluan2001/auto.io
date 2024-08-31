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
import palette from './palette';
import shadows, { customShadows } from './shadows';
import shape from './shape';
import typography from './SmartRTypography';

// ----------------------------------------------------------------------

export default function ThemeConfig({ children }: { children: any }) {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      ...palette.darkMode,
    },
  });

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
