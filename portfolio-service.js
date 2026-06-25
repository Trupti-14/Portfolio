(function createPortfolioService() {
  const clone = (value) =>
    typeof structuredClone === "function"
      ? structuredClone(value)
      : JSON.parse(JSON.stringify(value));

  const byOrder = (rows = []) =>
    [...rows].sort(
      (a, b) => (a.display_order ?? a.order ?? 0) - (b.display_order ?? b.order ?? 0)
    );

  const mapCurrentBuilding = (row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    description: row.description,
    tags: row.tags || [],
    visible: row.visible,
    order: row.display_order
  });

  const mapProject = (row) => ({
    id: row.id,
    title: row.title,
    label: row.label || "",
    description: row.description,
    contribution: row.contribution || "",
    tags: row.tags || [],
    github: row.github || "",
    live: row.live || "",
    image: row.image || "",
    imageAlt: row.image_alt || `${row.title} project preview`,
    imageWidth: row.image_width || 1600,
    imageHeight: row.image_height || 900,
    featured: row.featured,
    visible: row.visible,
    order: row.display_order
  });

  const mapAchievement = (row) => ({
    id: row.id,
    group: row.group_key || "technical",
    rank: row.rank || "",
    title: row.title,
    category: row.category || "",
    description: row.description,
    primary: row.primary,
    image: row.image || "",
    imageAlt: row.image_alt || row.title,
    imageFit: row.image_fit || "cover",
    proofImages: row.proof_images || [],
    visible: row.visible,
    order: row.display_order
  });

  const mapSkill = (row) => ({
    id: row.id,
    title: row.category,
    items: row.skills || [],
    wide: row.wide,
    visible: row.visible,
    order: row.display_order
  });

  const mapCertification = (row) => ({
    id: row.id,
    type: row.issuer || row.type || "",
    title: row.title,
    issuer: row.issuer || "",
    description: row.description,
    tags: row.tags || [],
    image: row.image || "",
    imageAlt: row.image_alt || `${row.title} certificate`,
    imageWidth: row.image_width || 1200,
    imageHeight: row.image_height || 800,
    link: row.link || "",
    visible: row.visible,
    order: row.display_order
  });

  const mapGallery = (row) => ({
    id: row.id,
    title: row.title,
    caption: row.caption || "",
    src: row.src || "",
    alt: row.alt || row.title,
    type: row.type || "achievement",
    fit: row.fit || "cover",
    imageWidth: row.image_width || 1200,
    imageHeight: row.image_height || 800,
    visible: row.visible,
    order: row.display_order
  });

  const mapCodingProfile = (row) => ({
    id: row.id,
    platform: row.platform,
    username: row.username || "",
    url: row.url || "",
    visible: row.visible,
    order: row.display_order
  });

  const mapQuote = (row) => ({
    id: row.id,
    visible: row.visible !== false,
    text: row.quote_text,
    author: row.author || "",
    context: row.context || "",
    order: row.display_order
  });

  function localDayNumber(date = new Date()) {
    return Math.floor(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000
    );
  }

  function selectDailyQuote(rows = [], date = new Date()) {
    const visibleQuotes = byOrder(rows).filter(
      (row) => row && row.visible !== false && row.quote_text
    );
    if (!visibleQuotes.length) return null;
    const index = localDayNumber(date) % visibleQuotes.length;
    return mapQuote(visibleQuotes[index]);
  }

  function defaultQuote(date = new Date()) {
    return selectDailyQuote(window.DEFAULT_QUOTES || [], date);
  }

  function applyDefaultQuote(local, date = new Date()) {
    const selected = defaultQuote(date);
    if (selected) local.quote = selected;
    else if (!local.quote?.text) {
      local.quote = { visible: false, text: "", author: "", context: "" };
    }
    return local;
  }

  async function safeSelect(client, table, columns = "*") {
    const { data, error } = await client.from(table).select(columns);
    if (error) throw error;
    return data || [];
  }

  async function safeOptionalSelect(client, table) {
    try {
      const { data, error } = await client
        .from(table)
        .select("*")
        .order("display_order", { ascending: true });
      if (error) return { available: false, rows: [] };
      return { available: true, rows: data || [] };
    } catch {
      return { available: false, rows: [] };
    }
  }

  async function loadPortfolio(fallback) {
    const local = clone(fallback);
    const fallbackContact = clone(fallback.contact || {});
    const client = await window.PortfolioSupabase?.ready;
    if (!client) return applyDefaultQuote(local);

    try {
      const [
        metaResult,
        linksResult,
        quoteResult,
        quoteLibraryResult,
        building,
        projects,
        achievements,
        skills,
        certifications,
        gallery,
        codingProfiles
      ] = await Promise.all([
        client.from("portfolio_meta").select("content").eq("id", "main").maybeSingle(),
        client.from("portfolio_links").select("content").eq("id", "main").maybeSingle(),
        client.from("portfolio_quote").select("*").eq("id", "main").maybeSingle(),
        safeOptionalSelect(client, "quotes"),
        safeSelect(client, "currently_building"),
        safeSelect(client, "projects"),
        safeSelect(client, "achievements"),
        safeSelect(client, "skills"),
        safeSelect(client, "certifications"),
        safeSelect(client, "gallery"),
        safeSelect(client, "coding_profiles")
      ]);

      if (metaResult.error) throw metaResult.error;
      if (linksResult.error) throw linksResult.error;
      if (quoteResult.error) throw quoteResult.error;

      const meta = metaResult.data?.content;
      const databaseInitialized = meta?.supabase_initialized === true;
      const quoteLibraryInitialized =
        meta?.quote_library_initialized === true;
      const quoteLibraryHasEntries =
        meta?.quote_library_has_entries === true;
      if (meta && typeof meta === "object") {
        Object.assign(local, meta);
      }
      if (
        fallbackContact.copyVersion &&
        local.contact?.copyVersion !== fallbackContact.copyVersion
      ) {
        local.contact = fallbackContact;
      }

      const links = linksResult.data?.content;
      if (links && typeof links === "object") {
        local.links = { ...(local.links || {}), ...links };
      }

      const dailyQuote = selectDailyQuote(quoteLibraryResult.rows);
      if (quoteLibraryResult.available && dailyQuote) {
        local.quote = dailyQuote;
      } else if (quoteLibraryResult.available && quoteLibraryHasEntries) {
        local.quote = { visible: false, text: "", author: "", context: "" };
      } else if (
        quoteLibraryResult.available &&
        (quoteLibraryInitialized || !quoteLibraryResult.rows.length)
      ) {
        applyDefaultQuote(local);
      } else if (defaultQuote()) {
        applyDefaultQuote(local);
      } else if (quoteResult.data) {
        local.quote = {
          visible: quoteResult.data.visible,
          text: quoteResult.data.quote_text,
          author: quoteResult.data.author,
          context: quoteResult.data.context
        };
      } else if (databaseInitialized) {
        local.quote = { visible: false, text: "", author: "", context: "" };
      }

      if (databaseInitialized) {
        local.currentlyBuilding = byOrder(building).map(mapCurrentBuilding);
        local.projects = byOrder(projects).map(mapProject);
        local.achievements = byOrder(achievements).map(mapAchievement);
        local.skills = byOrder(skills).map(mapSkill);
        local.certifications = byOrder(certifications).map(mapCertification);
        local.gallery = byOrder(gallery).map(mapGallery);
        local.codingProfiles = byOrder(codingProfiles).map(mapCodingProfile);
      }

      local.__source = "supabase";
      return local;
    } catch (error) {
      console.warn("Supabase content unavailable; using local portfolio fallback.");
      local.__source = "local";
      return applyDefaultQuote(local);
    }
  }

  window.PortfolioService = {
    loadPortfolio,
    clone,
    selectDailyQuote,
    localDayNumber,
    defaultQuote
  };
})();
