/* SV Management Portal — API runtime
 * Talks to the PHP/MySQL backend that you deploy on cPanel (see /backend).
 * The API base URL is fixed to API_BASE below.
 *
 * Offline / local mode: when no API base URL is configured (or the server is
 * unreachable) every module keeps working against localStorage, so all CRUD
 * operations in Projects, Pipeline, Marketing, Maintenance, Portfolio, Team,
 * Credentials, Revenue and Commercials persist on the machine.
 */
(function () {
  var TOKEN_KEY = "sv_token";
  var API_BASE = "https://taskmanager.svdigital.ae/api";
  var LOCAL_KEY = "sv_local_user";
  var FILE_PREFIX = "sv_local_file:";

  function base() {
    return API_BASE.replace(/\/+$/, "");
  }
  function token() {
    return localStorage.getItem(TOKEN_KEY) || "";
  }
  function localUser() {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_KEY) || "null");
    } catch (e) {
      return null;
    }
  }
  function isRemote() {
    return !!base() && !localUser();
  }

  async function request(path, options) {
    options = options || {};
    if (!base()) throw new Error("No API base URL configured");
    var headers = options.headers || {};
    if (!(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
    if (token()) {
      headers["Authorization"] = "Bearer " + token();
      // LiteSpeed/cPanel can strip Authorization; this custom header always reaches PHP.
      headers["X-Auth-Token"] = token();
    }
    var res = await fetch(base() + path, {
      method: options.method || "GET",
      headers: headers,
      body: options.body,
    });
    var text = await res.text();
    var data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      throw new Error("Invalid response from API (" + res.status + ")");
    }
    if (!res.ok) throw new Error(data.error || "Request failed (" + res.status + ")");
    return data;
  }

  function uid(prefix) {
    return prefix + "-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function readLocalActivityLog() {
    try {
      var raw = localStorage.getItem("sv_activity_log") || "[]";
      var items = JSON.parse(raw);
      return Array.isArray(items) ? items : [];
    } catch (e) {
      return [];
    }
  }

  function writeLocalActivityLog(items) {
    localStorage.setItem("sv_activity_log", JSON.stringify((items || []).slice(0, 500)));
  }

  function appendLocalActivity(action, target, detail) {
    var user = window.SV_USER || localUser() || { name: "System" };
    var item = {
      id: uid("log"),
      created_at: new Date().toISOString(),
      user_name: user.name || "System",
      action: action || "save",
      target: target || "portal",
      detail: detail || "",
      isLocal: true,
    };
    var list = readLocalActivityLog();
    list.unshift(item);
    writeLocalActivityLog(list);
    return item;
  }

  // Shared, org-wide module keys stored in MySQL (app_store.user_id IS NULL).
  var MODULE_KEYS = [
    "svops:team",
    "svops:projects",
    "svops:commercials",
    "svops:revenue",
    "svops:revenueTargets",
    "svops:pipeline",
    "svops:portfolio",
    "svops:marketing",
    "svops:maintenance",
    "svops:credentials",
  ];


  var SVApi = {
    getBase: function () {
      return base();
    },
    isAuthed: function () {
      return !!token() || !!localUser();
    },
    isLocal: function () {
      return !!localUser();
    },
    loginLocal: function (name) {
      var user = {
        id: 0,
        name: name || "Local Admin",
        email: "local@offline",
        role: "admin",
      };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(user));
      window.SV_USER = user;
      return user;
    },
    // Checks the API base URL + MySQL connection without signing in.
    health: async function (url) {
      var target = (url || base()).replace(/\/+$/, "");
      if (!target) throw new Error("Enter an API base URL first");
      var res = await fetch(target + "/health.php", { headers: { Accept: "application/json" } });
      var data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error("That URL did not return the portal API (HTTP " + res.status + ")");
      }
      if (!data.ok) throw new Error(data.error || "API reachable but not ready");
      return data;
    },
    login: async function (email, password) {
      localStorage.removeItem(LOCAL_KEY);
      var data = await request("/auth.php?action=login", {
        method: "POST",
        body: JSON.stringify({ email: email, password: password }),
      });
      localStorage.setItem(TOKEN_KEY, data.token);
      window.SV_USER = data.user;
      try {
        await SVApi.recordActivity('login', 'auth', 'Signed in as ' + (data.user && data.user.email ? data.user.email : 'user'));
      } catch (e) {}
      try {
        await SVApi.syncLocalToRemote();
      } catch (e) {
        /* non-fatal: the portal still loads from the server */
      }
      return data.user;
    },
    // Pushes any locally cached module data to MySQL for keys the server does
    // not have yet (first sign-in after working offline), then refreshes the cache.
    syncLocalToRemote: async function () {
      if (!isRemote()) return { ok: true, skipped: true };
      var keys = MODULE_KEYS.slice();
      var data = await request(
        "/store.php?shared=1&keys=" + encodeURIComponent(keys.join(",")),
      );
      var values = data.values || {};
      var entries = [];
      keys.forEach(function (key) {
        var remote = values[key];
        var local = localStorage.getItem("cache:" + key);
        if ((remote === null || remote === undefined) && local !== null) {
          entries.push({ key: key, value: local, shared: true });
        } else if (remote !== null && remote !== undefined) {
          localStorage.setItem("cache:" + key, remote);
        }
      });
      if (entries.length) {
        await request("/store.php", {
          method: "POST",
          body: JSON.stringify({ entries: entries }),
        });
      }
      return { ok: true, pushed: entries.length };
    },

    me: async function () {
      var lu = localUser();
      if (lu) {
        window.SV_USER = lu;
        return lu;
      }
      var data = await request("/auth.php?action=me");
      window.SV_USER = data.user;
      return data.user;
    },
    logout: function () {
      if (isRemote() && token()) {
        try {
          fetch(base() + "/auth.php?action=logout", {
            method: "POST",
            headers: { Authorization: "Bearer " + token(), "X-Auth-Token": token() },
            keepalive: true,
          });
        } catch (e) {}
      }
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(LOCAL_KEY);
      window.SV_USER = null;
    },
    changePassword: async function (current, next) {
      var res = await request("/auth.php?action=password", {
        method: "POST",
        body: JSON.stringify({ current_password: current, new_password: next }),
      });
      try {
        await SVApi.recordActivity('password_change', 'auth', 'Changed password for ' + (window.SV_USER && window.SV_USER.email ? window.SV_USER.email : 'current user'));
      } catch (e) {}
      return res;
    },
    listUsers: function () {
      return request("/users.php");
    },
    createUser: function (payload) {
      return request("/users.php", { method: "POST", body: JSON.stringify(payload) });
    },
    updateUser: function (id, payload) {
      return request("/users.php?id=" + encodeURIComponent(id), {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    },
    deleteUser: function (id) {
      return request("/users.php?id=" + encodeURIComponent(id), { method: "DELETE" });
    },
    listFiles: function (projectId) {
      return request("/upload.php" + (projectId ? "?project_id=" + encodeURIComponent(projectId) : ""));
    },
    // Generic REST access to module records (backend/api.php).
    records: {
      list: function (module, q) {
        return request("/api.php?module=" + module + (q ? "&q=" + encodeURIComponent(q) : ""));
      },
      get: function (module, id) {
        return request("/api.php?module=" + module + "&id=" + encodeURIComponent(id));
      },
      create: function (module, rec) {
        return request("/api.php?module=" + module, { method: "POST", body: JSON.stringify(rec) });
      },
      update: function (module, id, patch) {
        return request("/api.php?module=" + module + "&id=" + encodeURIComponent(id), {
          method: "PUT",
          body: JSON.stringify(patch),
        });
      },
      remove: function (module, id) {
        return request("/api.php?module=" + module + "&id=" + encodeURIComponent(id), { method: "DELETE" });
      },
      summary: function () {
        return request("/api.php");
      },
    },
    recordActivity: async function (action, target, detail) {
      try {
        if (isRemote()) {
          await request("/activity.php", {
            method: "POST",
            body: JSON.stringify({ action: action || "save", target: target || "portal", detail: detail || "" }),
          });
          return true;
        }
      } catch (e) {
        // Fall back to local logging when the server is unavailable.
      }
      appendLocalActivity(action, target, detail);
      return true;
    },
    activity: async function (limit) {
      var items = readLocalActivityLog();
      try {
        if (isRemote()) {
          var data = await request("/activity.php?limit=" + (limit || 200));
          var remote = Array.isArray(data.items) ? data.items : [];
          var merged = remote.concat(items)
            .sort(function (a, b) {
              return new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0);
            })
            .slice(0, limit || 200);
          return { items: merged };
        }
      } catch (e) {}
      return { items: items.slice(0, limit || 200) };
    },
    backupExport: function () {
      return request("/backup.php");
    },
    backupImport: function (payload) {
      return request("/backup.php", { method: "POST", body: JSON.stringify(payload) });
    },
    upload: async function (file, projectId) {
      if (isRemote()) {
        var fd = new FormData();
        fd.append("file", file);
        fd.append("project_id", projectId || "");
        try {
          var data = await request("/upload.php", { method: "POST", body: fd });
          return data.file;
        } catch (e) {
          /* fall through to local storage of the file */
        }
      }
      var dataUrl = await new Promise(function (resolve, reject) {
        var r = new FileReader();
        r.onload = function () {
          resolve(String(r.result));
        };
        r.onerror = function () {
          reject(new Error("Could not read file"));
        };
        r.readAsDataURL(file);
      });
      var meta = {
        id: uid("file"),
        original_name: file.name,
        mime_type: file.type || "application/octet-stream",
        size_bytes: file.size,
        project_id: projectId || null,
        local: true,
      };
      try {
        localStorage.setItem(FILE_PREFIX + meta.id, dataUrl);
      } catch (e) {
        throw new Error("File too large for local storage — configure the API base URL.");
      }
      meta.url = FILE_PREFIX + meta.id;
      return meta;
    },
    fileUrl: function (meta) {
      if (!meta) return "#";
      if (meta.local) return localStorage.getItem(FILE_PREFIX + meta.id) || "#";
      return (
        base() +
        "/upload.php?id=" +
        encodeURIComponent(meta.id) +
        "&download=1&token=" +
        encodeURIComponent(token())
      );
    },
    deleteFile: async function (id) {
      if (localStorage.getItem(FILE_PREFIX + id) !== null) {
        localStorage.removeItem(FILE_PREFIX + id);
        return { ok: true };
      }
      if (!isRemote()) return { ok: true };
      return request("/upload.php?id=" + encodeURIComponent(id), { method: "DELETE" });
    },
  };

  /* Storage shim consumed by the portal engine (window.storage.get/set).
     Always mirrors to localStorage so every module works offline. */
  var storage = {
    get: async function (key, shared) {
      var cacheKey = "cache:" + key;
      if (isRemote()) {
        try {
          var data = await request(
            "/store.php?key=" + encodeURIComponent(key) + "&shared=" + (shared ? 1 : 0),
          );
          if (data.value !== null && data.value !== undefined) {
            localStorage.setItem(cacheKey, data.value);
            return { value: data.value };
          }
          return null;
        } catch (e) {
          /* offline — fall back to the local cache below */
        }
      }
      var local = localStorage.getItem(cacheKey);
      return local === null ? null : { value: local };
    },
    set: async function (key, value, shared) {
      localStorage.setItem("cache:" + key, value);
      if (!isRemote()) return { ok: true, local: true };
      try {
        return await request("/store.php", {
          method: "POST",
          body: JSON.stringify({ key: key, value: value, shared: !!shared }),
        });
      } catch (e) {
        return { ok: true, local: true, error: e && e.message };
      }
    },
  };

  window.SVApi = SVApi;
  window.storage = storage;
})();
