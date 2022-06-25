import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      light: "#C8C2FF",
      main: "#857AFD",
      dark: "#38308A",
      contrastText: "#000",
    },
  },
  typography: {
    fontFamily: ["Jost"].join(","),
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
