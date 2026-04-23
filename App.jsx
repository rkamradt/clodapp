import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
 
const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
  :root {
    --bg:        #0a0c0f;
    --surface:   #111318;
    --border:    #1e2330;
    --accent:    #00e5ff;
    --accent-dim:#007a8a;
    --danger:    #ff4757;
    --text:      #c8d0e0;
    --text-dim:  #4a5568;
    --mono:      'Share Tech Mono', monospace;
    --sans:      'Rajdhani', sans-serif;
  }
 
  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    min-height: 100vh;
    overflow-x: hidden;
  }
 
  /* scanline overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.03) 2px,
      rgba(0,0,0,0.03) 4px
    );
    pointer-events: none;
    z-index: 9999;
  }
 
  .frame {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
 
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    width: 100%;
    max-width: 480px;
    padding: 0;
    position: relative;
    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
  }
 
  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
    background: linear-gradient(135deg, rgba(0,229,255,0.04) 0%, transparent 60%);
    pointer-events: none;
  }
 
  .card-header {
    padding: 1.5rem 2rem 1rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
 
  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
    animation: pulse 2s ease-in-out infinite;
  }
 
  .indicator.online  { background: var(--accent); box-shadow: 0 0 8px var(--accent); }
  .indicator.offline { background: var(--danger);  box-shadow: 0 0 8px var(--danger); animation: none; }
 
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.4; }
  }
 
  .system-id {
    font-family: var(--mono);
    font-size: 0.65rem;
    color: var(--text-dim);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }
 
  .card-body {
    padding: 2.5rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
 
  .status-block {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
 
  .status-label {
    font-family: var(--mono);
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    color: var(--text-dim);
    text-transform: uppercase;
  }
 
  .status-value {
    font-family: var(--sans);
    font-size: 2.2rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    line-height: 1;
  }
 
  .status-value.authenticated   { color: var(--accent); }
  .status-value.unauthenticated { color: var(--text-dim); }
 
  .user-info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(0,229,255,0.03);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
  }
 
  .field {
    display: grid;
    grid-template-columns: 90px 1fr;
    gap: 0.5rem;
    align-items: start;
  }
 
  .field-key {
    font-family: var(--mono);
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    color: var(--text-dim);
    text-transform: uppercase;
    padding-top: 2px;
  }
 
  .field-val {
    font-family: var(--mono);
    font-size: 0.78rem;
    color: var(--text);
    word-break: break-all;
  }
 
  .avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid var(--accent-dim);
    vertical-align: middle;
    margin-right: 0.5rem;
  }
 
  .btn {
    font-family: var(--mono);
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    border: none;
    padding: 0.85rem 1.5rem;
    cursor: pointer;
    width: 100%;
    transition: all 0.15s ease;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    position: relative;
  }
 
  .btn-login {
    background: var(--accent);
    color: var(--bg);
  }
 
  .btn-login:hover {
    background: #33eaff;
    box-shadow: 0 0 20px rgba(0,229,255,0.4);
  }
 
  .btn-logout {
    background: transparent;
    color: var(--danger);
    border: 1px solid var(--danger);
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  }
 
  .btn-logout:hover {
    background: rgba(255,71,87,0.1);
    box-shadow: 0 0 20px rgba(255,71,87,0.2);
  }
 
  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
 
  .loading {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: var(--mono);
    font-size: 0.7rem;
    color: var(--text-dim);
    letter-spacing: 0.1em;
  }
 
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
 
  @keyframes spin { to { transform: rotate(360deg); } }
 
  .footer {
    margin-top: 2rem;
    font-family: var(--mono);
    font-size: 0.6rem;
    color: var(--text-dim);
    letter-spacing: 0.1em;
    text-align: center;
  }
 
  .token-block {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(0,229,255,0.03);
    border: 1px solid var(--border);
    border-left: 3px solid var(--accent-dim);
  }

  .token-label {
    font-family: var(--mono);
    font-size: 0.6rem;
    letter-spacing: 0.2em;
    color: var(--text-dim);
    text-transform: uppercase;
  }

  .token-raw {
    font-family: var(--mono);
    font-size: 0.65rem;
    color: var(--text-dim);
    word-break: break-all;
    cursor: pointer;
    transition: color 0.15s;
  }

  .token-raw:hover { color: var(--accent); }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card { animation: fadeIn 0.4s ease; }
`
 
function decodeJwtPayload(token) {
  const parts = token.split('.')
  if (parts.length === 5) return { _encrypted: true }
  if (parts.length !== 3) return null
  try {
    return JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

export default function App() {
  const { isAuthenticated, isLoading, user, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0()
  const [token, setToken] = useState(null)
  const [claims, setClaims] = useState(null)

  useEffect(() => {
    if (!isAuthenticated) { setToken(null); setClaims(null); return }
    getAccessTokenSilently()
      .then(t => { setToken(t); setClaims(decodeJwtPayload(t)) })
      .catch(() => { setToken(null); setClaims(null) })
  }, [isAuthenticated, getAccessTokenSilently])
 
  return (
    <>
      <style>{styles}</style>
      <div className="frame">
        <div className="card">
          <div className="card-header">
            <div className={`indicator ${isAuthenticated ? 'online' : 'offline'}`} />
            <span className="system-id">rkamradt // platform // auth subsystem</span>
          </div>
 
          <div className="card-body">
            {isLoading ? (
              <div className="loading">
                <div className="spinner" />
                initializing auth context...
              </div>
            ) : (
              <>
                <div className="status-block">
                  <div className="status-label">session status</div>
                  <div className={`status-value ${isAuthenticated ? 'authenticated' : 'unauthenticated'}`}>
                    {isAuthenticated ? 'AUTHENTICATED' : 'UNAUTHENTICATED'}
                  </div>
                </div>
 
                {isAuthenticated && user && (
                  <div className="user-info">
                    <div className="field">
                      <span className="field-key">identity</span>
                      <span className="field-val">
                        {user.picture && <img src={user.picture} alt="" className="avatar" />}
                        {user.name}
                      </span>
                    </div>
                    <div className="field">
                      <span className="field-key">email</span>
                      <span className="field-val">{user.email}</span>
                    </div>
                    <div className="field">
                      <span className="field-key">sub</span>
                      <span className="field-val">{user.sub}</span>
                    </div>
                  </div>
                )}
 
                {isAuthenticated && token && (
                  <div className="token-block">
                    <div className="token-label">access token</div>
                    {claims && claims._encrypted && (
                      <div className="field">
                        <span className="field-key">warning</span>
                        <span className="field-val" style={{color: 'var(--danger)'}}>encrypted JWE — disable token encryption in Auth0 API settings to get a readable JWT</span>
                      </div>
                    )}
                    {claims && !claims._encrypted && (
                      <>
                        <div className="field">
                          <span className="field-key">aud</span>
                          <span className="field-val">{[].concat(claims.aud).join(', ')}</span>
                        </div>
                        <div className="field">
                          <span className="field-key">exp</span>
                          <span className="field-val">{new Date(claims.exp * 1000).toISOString()}</span>
                        </div>
                        <div className="field">
                          <span className="field-key">scope</span>
                          <span className="field-val">{claims.scope || '—'}</span>
                        </div>
                      </>
                    )}
                    <div className="token-label" style={{marginTop: '0.25rem'}}>raw (click to copy)</div>
                    <div
                      className="token-raw"
                      onClick={() => navigator.clipboard.writeText(token)}
                      title="Click to copy"
                    >
                      {token.slice(0, 40)}…
                    </div>
                  </div>
                )}

                {isAuthenticated ? (
                  <button
                    className="btn btn-logout"
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  >
                    terminate session
                  </button>
                ) : (
                  <button
                    className="btn btn-login"
                    onClick={() => loginWithRedirect()}
                  >
                    authenticate
                  </button>
                )}
              </>
            )}
          </div>
        </div>
 
        <div className="footer">
          node: kubernetes.default.svc &nbsp;|&nbsp; auth: auth0 oidc
        </div>
      </div>
    </>
  )
}
 
