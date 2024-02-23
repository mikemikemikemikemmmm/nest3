import React from 'react'
import { StyledEngineProvider } from '@mui/material/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '../src/style/index.css'
import { store } from './store'
import { browserRouter } from './router';
const mdTheme = createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTextField:{
      defaultProps: {
        size: 'small',
      },
    }
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 300,
      md: 600,
      lg: 900,
      xl: 1200,
    },
  },
});
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={mdTheme}>
      <StyledEngineProvider injectFirst>
        <Provider store={store}>
          <RouterProvider router={browserRouter} />
        </Provider>
      </StyledEngineProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
