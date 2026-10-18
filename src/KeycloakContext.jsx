import { createContext, useContext, useEffect, useState } from 'react'
import Keycloak from 'keycloak-js'

const keycloakInstance = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
})

const KeycloakContext = createContext(null)

export function KeycloakProvider({ children }) {
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    keycloakInstance
      .init({ onLoad: 'check-sso', pkceMethod: 'S256' })
      .then(() => setInitialized(true))
      .catch(console.error)
  }, [])

  return (
    <KeycloakContext.Provider value={{ keycloak: keycloakInstance, initialized }}>
      {children}
    </KeycloakContext.Provider>
  )
}

export function useKeycloak() {
  return useContext(KeycloakContext)
}
