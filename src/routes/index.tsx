import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SV Management Portal — Internal Operations Hub" },
      {
        name: "description",
        content:
          "Internal SV Digital operations portal: projects, pipeline, clients, team, credentials, revenue and commercials in one workspace.",
      },
      { property: "og:title", content: "SV Management Portal — Internal Operations Hub" },
      {
        property: "og:description",
        content:
          "Track projects, pipeline, clients, team, credentials and revenue across every SV Digital engagement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "stylesheet", href: "/portal.css" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  component: PortalPage,
  ssr: false,
});

type SVUser = { id: number; name: string; email: string; role: "admin" | "member" };

declare global {
  interface Window {
    SVApi: {
      setBase: (url: string) => void;
      getBase: () => string;
      isAuthed: () => boolean;
      isLocal: () => boolean;
      loginLocal: (name?: string) => SVUser;
      login: (email: string, password: string) => Promise<SVUser>;
      me: () => Promise<SVUser>;
      logout: () => void;
      health: (url?: string) => Promise<{
        ok: boolean;
        php: string;
        database?: { connected: boolean; name?: string; server?: string };
        counts?: { users: number; records: number; files: number };
        uploads?: { writable: boolean; maxUpload: number };
      }>;
      syncLocalToRemote: () => Promise<{ ok: boolean; pushed?: number }>;
      changePassword: (current: string, next: string) => Promise<unknown>;
    };

    SV_USER: SVUser | null;
    openUsersManager?: () => void;
    openPasswordForm?: () => void;

    storage: unknown;
  }
}


const scriptPromises = new Map<string, Promise<void>>();

function loadScript(src: string) {
  const cached = scriptPromises.get(src);
  if (cached) return cached;
  const promise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.dataset.sv = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(s);
  });
  scriptPromises.set(src, promise);
  return promise;
}


function PortalPage() {
  const [runtimeReady, setRuntimeReady] = useState(false);
  const [user, setUser] = useState<SVUser | null>(null);
  const [booting, setBooting] = useState(true);
  const engineLoaded = useRef(false);

  useEffect(() => {
    let cancelled = false;
    loadScript("/portal-runtime.js")
      .then(async () => {
        if (cancelled) return;
        setRuntimeReady(true);
        if (window.SVApi.isAuthed() && (window.SVApi.getBase() || window.SVApi.isLocal())) {
          try {
            const me = await window.SVApi.me();
            if (!cancelled) setUser(me);
          } catch {
            window.SVApi.logout();
          }
        }
      })
      .finally(() => !cancelled && setBooting(false));
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user || engineLoaded.current) return;
    engineLoaded.current = true;
    window.SV_USER = user;
    void loadScript("/portal-engine.js");
  }, [user]);

  const handleLogout = useCallback(() => {
    window.SVApi.logout();
    window.location.reload();
  }, []);

  if (booting) {
    return <div style={{ minHeight: "100vh", background: "#1C1B1A" }} />;
  }

  if (!user) {
    return <LoginScreen ready={runtimeReady} onSignedIn={setUser} />;
  }

  return <PortalShell user={user} onLogout={handleLogout} />;
}

function LoginScreen({
  ready,
  onSignedIn,
}: {
  ready: boolean;
  onSignedIn: (u: SVUser) => void;
}) {
  const [apiBase, setApiBase] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (ready) setApiBase(window.SVApi.getBase());
  }, [ready]);

  async function testConnection() {
    setError("");
    setStatus("");
    if (!apiBase.trim()) {
      setError("Enter your API base URL (your cPanel backend folder).");
      return;
    }
    setTesting(true);
    try {
      const h = await window.SVApi.health(apiBase.trim());
      window.SVApi.setBase(apiBase.trim());
      setStatus(
        `Connected · MySQL ${h.database?.server ?? ""} · ${h.counts?.users ?? 0} users · ` +
          `${h.counts?.records ?? 0} saved records · uploads ${h.uploads?.writable ? "ready" : "not writable"}`,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connection failed");
    } finally {
      setTesting(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setStatus("");
    if (!apiBase.trim()) {
      setError("Enter your API base URL (your cPanel backend folder).");
      return;
    }
    setBusy(true);
    try {
      window.SVApi.setBase(apiBase.trim());
      const u = await window.SVApi.login(email.trim(), password);
      onSignedIn(u);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setBusy(false);
    }
  }


  return (
    <div id="login-screen">
      <div className="login-grid-lines" />
      <form className="login-card" onSubmit={submit}>
        <div className="login-mark">
          <div className="dot" />
          <span>SV Digital</span>
        </div>
        <div className="login-title">Management Portal</div>
        <div className="login-sub">
          Sign in with your team account to access projects, clients and commercials.
        </div>

        <div className="login-field">
          <label htmlFor="api-base">API base URL</label>
          <input
            id="api-base"
            value={apiBase}
            onChange={(e) => setApiBase(e.target.value)}
            placeholder="https://yourdomain.com/portal-api"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={testConnection}
            disabled={!ready || testing}
            style={{
              marginTop: 8,
              padding: "7px 12px",
              fontSize: 12,
              borderRadius: 8,
              cursor: "pointer",
              background: "transparent",
              color: "inherit",
              border: "1px solid rgba(255,255,255,.18)",
            }}
          >
            {testing ? "Testing…" : "Test connection"}
          </button>
          {status && (
            <div style={{ marginTop: 8, fontSize: 12, color: "#5fd0a3" }}>{status}</div>
          )}
        </div>

        <div className="login-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className="login-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>

        <button className="login-btn" type="submit" disabled={busy || !ready}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <div className="login-error">{error}</div>
        <button
          type="button"
          className="login-btn"
          style={{ background: "transparent", border: "1px solid rgba(255,255,255,.18)" }}
          disabled={!ready}
          onClick={() => onSignedIn(window.SVApi.loginLocal())}
        >
          Continue offline (local data)
        </button>
        <div className="login-hint">
          Offline mode runs every module against this device&rsquo;s local storage — all add, edit
          and delete actions work and persist locally. For shared team data, deploy the{" "}
          <code>/backend</code> folder on cPanel (PHP + MySQL) and point the API base URL at it.
          Default seeded admin: <code>admin@svdigital.ae</code> / <code>ChangeMe123!</code>
        </div>

      </form>
    </div>
  );
}

function PortalShell({ user, onLogout }: { user: SVUser; onLogout: () => void }) {
  return (
    <>
      <div id="app" className="active">
        <div id="sidebar">
          <div className="sb-logo" aria-label="Application logo" aria-hidden="true" />
          <div className="sb-nav" id="sb-nav" />
        </div>
        <div id="main">
          <div id="topbar">
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div>
                <div className="topbar-title" id="view-title">
                  Dashboard
                </div>
                <div className="topbar-sub" id="view-sub">
                  Overview across all active engagements
                </div>
              </div>
            </div>
            <div className="topbar-right">
              <button
                className="btn-ghost"
                id="theme-toggle-btn"
                onClick={() => window.toggleTheme?.()}
                style={{ fontSize: 12 }}
              >
                🌙 Dark
              </button>
              {user.role === "admin" && !window.SVApi?.isLocal?.() && (
                <button
                  className="btn-ghost"
                  onClick={() => window.openUsersManager?.()}
                  style={{ fontSize: 12 }}
                >
                  👥 Users
                </button>
              )}
              {(user.role === "admin" || !window.SVApi?.isLocal?.()) && (
                <button
                  className="btn-ghost"
                  onClick={() => window.openActivityLog?.()}
                  style={{ fontSize: 12 }}
                >
                  📜 Log Book
                </button>
              )}
              {!window.SVApi?.isLocal?.() && (
                <button
                  className="btn-ghost"
                  style={{ fontSize: 12 }}
                  onClick={() => window.openPasswordForm?.()}
                >
                  🔑 Password
                </button>
              )}

              <span className="role-pill">
                {user.name} · {user.role === "admin" ? "Admin" : "Member"}
              </span>
              <button className="logout-btn" onClick={onLogout}>
                Sign out
              </button>
            </div>
          </div>
          <div id="content" />
        </div>
      </div>

      <div
        id="drilldown-overlay"
        onClick={(e) => {
          if (e.target === e.currentTarget) window.closeDrilldown?.();
        }}
      >
        <div id="drilldown-panel" />
      </div>

      <div className="form-modal-overlay" id="form-modal-overlay">
        <div className="form-modal" id="form-modal" />
      </div>
    </>
  );
}

declare global {
  interface Window {
    toggleTheme?: () => void;
    closeDrilldown?: () => void;
  }
}
