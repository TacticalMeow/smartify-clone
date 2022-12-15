import { Theme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface CustomTheme extends Theme {
    custom: {
        containerHeight: string;
    };
  }
  // allow configuration using `createTheme`
  interface CustomThemeOptions extends ThemeOptions {
    custom: {
        containerHeight: string;
    };
  }

  export function createTheme(options?: CustomThemeOptions): CustomTheme;
}
