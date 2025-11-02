import { lightTheme } from './light';
import { darkTheme } from './dark';

export interface Theme {
  colors: {
    background: string;
    text: string;
    card: string;
    primary: string;
    secondary: string;
    border: string;
    textSecondary: string;
    success: string;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
  typography: {
    h1: { fontSize: number; fontWeight: string };
    h2: { fontSize: number; fontWeight: string };
    body: { fontSize: number };
  };
  shadows: {
    small: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
}

export { lightTheme, darkTheme };
