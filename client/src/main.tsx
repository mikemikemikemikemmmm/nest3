import React from 'react'
import ReactDOM from 'react-dom/client'
import './style/index.css'
import { store } from './store'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { browserRouter } from './router'
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
        <RouterProvider router={browserRouter} />
    </Provider>
  </React.StrictMode>,
)
