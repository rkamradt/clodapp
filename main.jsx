import React from 'react'
import ReactDOM from 'react-dom/client'
import { KeycloakProvider } from './src/KeycloakContext'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <KeycloakProvider>
      <App />
    </KeycloakProvider>
  </React.StrictMode>
)
