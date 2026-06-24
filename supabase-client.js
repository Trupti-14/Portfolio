(function initializePortfolioSupabase() {
  const config = window.SUPABASE_CONFIG || {};
  const configured =
    typeof config.url === "string" &&
    config.url.startsWith("https://") &&
    typeof config.anonKey === "string" &&
    config.anonKey.length > 20;

  const state = {
    client: null,
    configured,
    config,
    ready: null
  };

  function loadLibrary() {
    if (window.supabase?.createClient) return Promise.resolve(window.supabase);
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.async = true;
      script.onload = () => resolve(window.supabase);
      script.onerror = () => reject(new Error("Unable to load Supabase client library."));
      document.head.append(script);
    });
  }

  state.ready = (async () => {
    if (!configured) return null;
    try {
      const library = await loadLibrary();
      state.client = library.createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      return state.client;
    } catch {
      state.client = null;
      return null;
    }
  })();

  state.getAdminAccess = async () => {
    try {
      const client = await state.ready;
      if (!client) return false;

      const { data: sessionData, error: sessionError } =
        await client.auth.getSession();
      if (sessionError || !sessionData?.session?.user) return false;

      const { data: allowed, error: accessError } =
        await client.rpc("is_portfolio_admin");
      return !accessError && allowed === true;
    } catch {
      return false;
    }
  };

  window.PortfolioSupabase = state;
})();
