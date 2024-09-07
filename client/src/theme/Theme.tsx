// material
import { CssBaseline } from '@mui/material';
import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider,
} from '@mui/material/styles';
import { useMemo } from 'react';
//
import { Palette, Theme } from '@material-ui/core';
import breakpoints from './breakpoints';
import GlobalStyles from './globalStyles';
import componentsOverride from './SmartROverrides';
import palette from './palette';
import shadows, { customShadows } from './shadows';
import shape from './shape';
import typography from './SmartRTypography';
import ComponentsOverrides from './overrides';
import { IPalette } from './palette/dark';

// ----------------------------------------------------------------------
interface ITheme extends Theme {
  palette: Palette & IPalette;
}
export type { ITheme };

export default function ThemeConfig({ children }: { children: any }) {
  const theme = createTheme({
    palette: {
      mode: 'dark',
      ...palette.darkMode,
    } as any,
    components: ComponentsOverrides as any,
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
