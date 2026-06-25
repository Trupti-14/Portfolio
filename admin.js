(() => {
  "use strict";

  const localData = window.PortfolioService
    ? window.PortfolioService.clone(window.PORTFOLIO_DATA)
    : JSON.parse(JSON.stringify(window.PORTFOLIO_DATA || {}));
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const REQUEST_TIMEOUT = 15000;
  const UPLOAD_TIMEOUT = 30000;

  const state = {
    client: null,
    user: null,
    meta: {},
    links: {},
    quote: {},
    collections: {},
    editing: {},
    initialized: false,
    initializing: null,
    quoteLibraryAvailable: false,
    quoteLibraryInitialized: false,
    quoteLibraryHasEntries: false
  };

  const configs = {
    currently_building: {
      title: "Currently Building",
      description: "Keep the public work-in-progress status concise and current.",
      fields: [
        field("id", "Stable ID", "text", { required: true }),
        field("title", "Title", "text", { required: true }),
        field("status", "Status", "text"),
        field("description", "Description", "textarea", { full: true }),
        field("tags", "Tags", "csv", { full: true }),
        field("visible", "Visible", "checkbox"),
        field("display_order", "Display order", "number")
      ],
      label: (row) => row.title || row.id,
      detail: (row) => row.status || row.description
    },
    projects: {
      title: "Projects",
      description: "Manage case studies, links, project emphasis, and optional screenshots.",
      bucket: "projects",
      assets: ["image"],
      fields: [
        field("id", "Stable ID", "text", { required: true }),
        field("title", "Project title", "text", { required: true }),
        field("label", "Label", "text"),
        field("description", "Description", "textarea", { full: true }),
        field("contribution", "My contribution", "textarea", { full: true }),
        field("tags", "Tech tags", "csv", { full: true }),
        field("github", "GitHub URL", "url"),
        field("live", "Live URL", "url"),
        field("image", "Screenshot URL", "url", { full: true }),
        field("image_file", "Upload screenshot", "file", {
          target: "image",
          accept: "image/jpeg,image/png,image/webp",
          full: true
        }),
        field("image_alt", "Screenshot alt text", "text", { full: true }),
        field("featured", "Featured project", "checkbox"),
        field("visible", "Visible", "checkbox"),
        field("display_order", "Display order", "number")
      ],
      label: (row) => row.title || row.id,
      detail: (row) => [row.label, row.featured ? "Featured" : ""].filter(Boolean).join(" · ")
    },
    achievements: {
      title: "Achievements",
      description: "Record the result, context, and optional proof for each achievement.",
      bucket: "achievements",
      assets: ["image", "proof_images"],
      fields: [
        field("id", "Stable ID", "text", { required: true }),
        field("title", "Achievement title", "text", { required: true }),
        field("rank", "Result / rank", "text"),
        field("category", "Category", "text"),
        field("group_key", "Group", "select", { options: ["technical", "leadership"] }),
        field("description", "Description", "textarea", { full: true }),
        field("image", "Primary proof URL", "url", { full: true }),
        field("image_file", "Upload primary proof", "file", {
          target: "image",
          accept: "image/jpeg,image/png,image/webp",
          full: true
        }),
        field("image_alt", "Primary proof alt text", "text", { full: true }),
        field("image_fit", "Primary image fit", "select", { options: ["cover", "contain"] }),
        field("proof_images", "Additional proof JSON", "json", {
          full: true,
          help: 'Optional: [{"src":"...","alt":"...","fit":"contain"}]'
        }),
        field("proof_files", "Upload additional proof", "file", {
          target: "proof_images",
          accept: "image/jpeg,image/png,image/webp",
          multiple: true,
          full: true
        }),
        field("primary", "Primary achievement", "checkbox"),
        field("visible", "Visible", "checkbox"),
        field("display_order", "Display order", "number")
      ],
      label: (row) => row.title || row.id,
      detail: (row) => [row.rank, row.group_key].filter(Boolean).join(" · ")
    },
    skills: {
      title: "Skills",
      description: "Use focused categories so the section reads like an engineering toolkit.",
      fields: [
        field("id", "Stable ID", "text", { required: true }),
        field("category", "Category", "text", { required: true }),
        field("skills", "Skills", "csv", { required: true, full: true }),
        field("wide", "Wide group", "checkbox"),
        field("visible", "Visible", "checkbox"),
        field("display_order", "Display order", "number")
      ],
      label: (row) => row.category || row.id,
      detail: (row) => (row.skills || []).join(" · ")
    },
    certifications: {
      title: "Certifications",
      description: "Keep credentials compact, consistent, and easy to verify.",
      bucket: "certificates",
      assets: ["image"],
      fields: [
        field("id", "Stable ID", "text", { required: true }),
        field("title", "Certification title", "text", { required: true }),
        field("issuer", "Issuer", "text"),
        field("type", "Type / program", "text"),
        field("description", "Description", "textarea", { full: true }),
        field("tags", "Tags", "csv", { full: true }),
        field("image", "Certificate image URL", "url", { full: true }),
        field("image_file", "Upload certificate", "file", {
          target: "image",
          accept: "image/jpeg,image/png,image/webp",
          full: true
        }),
        field("image_alt", "Image alt text", "text", { full: true }),
        field("link", "Credential URL", "url", { full: true }),
        field("visible", "Visible", "checkbox"),
        field("display_order", "Display order", "number")
      ],
      label: (row) => row.title || row.id,
      detail: (row) => [row.issuer, row.type].filter(Boolean).join(" · ")
    },
    quotes: {
      title: "Quote Library",
      description:
        "Visible quotes rotate automatically once per day. Display order controls the sequence.",
      fields: [
        field("id", "Stable ID", "text", { required: true }),
        field("quote_text", "Quote text", "textarea", { required: true, full: true }),
        field("author", "Author", "text"),
        field("context", "Context", "text", { full: true }),
        field("visible", "Visible", "checkbox"),
        field("display_order", "Display order", "number")
      ],
      label: (row) => row.author || row.quote_text || row.id,
      detail: (row) => row.quote_text
    },
    gallery: {
      title: "Gallery",
      description: "Add only curated supporting visuals that strengthen the portfolio.",
      bucket: "gallery",
      assets: ["src"],
      fields: [
        field("id", "Stable ID", "text", { required: true }),
        field("title", "Title", "text", { required: true }),
        field("caption", "Caption", "textarea", { full: true }),
        field("src", "Image URL", "url", { full: true }),
        field("image_file", "Upload image", "file", {
          target: "src",
          accept: "image/jpeg,image/png,image/webp",
          full: true
        }),
        field("alt", "Alt text", "text", { full: true }),
        field("type", "Type", "select", {
          options: ["achievement", "certificate", "event", "project"]
        }),
        field("fit", "Image fit", "select", { options: ["cover", "contain"] }),
        field("visible", "Visible", "checkbox"),
        field("display_order", "Display order", "number")
      ],
      label: (row) => row.title || row.id,
      detail: (row) => row.type || row.caption
    }
  };

  function field(name, label, type, options = {}) {
    return { name, label, type, ...options };
  }

  function withTimeout(operation, label, timeout = REQUEST_TIMEOUT) {
    let timer;
    const task = typeof operation === "function" ? operation() : operation;
    const timeoutPromise = new Promise((_, reject) => {
      timer = window.setTimeout(() => {
        reject(
          new Error(
            `${label} timed out. Check your network connection and Supabase RLS or Storage policies.`
          )
        );
      }, timeout);
    });
    return Promise.race([Promise.resolve(task), timeoutPromise]).finally(() => {
      window.clearTimeout(timer);
    });
  }

  function errorMessage(error, fallback = "The operation failed.") {
    const message = error?.message || fallback;
    if (/failed to fetch|networkerror|load failed/i.test(message)) {
      return `${fallback} Check your network connection and Supabase project availability.`;
    }
    return message;
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 72);
  }

  function toast(message, type = "success") {
    const node = $("#toast");
    node.textContent = message;
    node.classList.toggle("error", type === "error");
    node.classList.toggle("warning", type === "warning");
    node.hidden = false;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      node.hidden = true;
    }, 4200);
  }

  function setSync(message) {
    $("#sync-status").textContent = message;
  }

  function localHeadline() {
    const hero = localData.hero || {};
    return [hero.headlineBefore, hero.headlineEmphasis, hero.headlineAfter]
      .filter(Boolean)
      .join(" ");
  }

  function fallbackMeta() {
    return clone({
      site: localData.site || {},
      profile: localData.profile || {},
      hero: { ...(localData.hero || {}), fullHeadline: localHeadline() },
      proofStrip: localData.proofStrip || [],
      sectionHeadings: localData.sectionHeadings || {},
      education: localData.education || {},
      achievementGroups: localData.achievementGroups || [],
      contact: localData.contact || {},
      footer: localData.footer || {},
      supabase_initialized: false
    });
  }

  function fallbackCollections() {
    return {
      currently_building: (localData.currentlyBuilding || []).map((row, index) => ({
        id: row.id,
        title: row.title,
        status: row.status || "",
        description: row.description || "",
        tags: clone(row.tags || []),
        visible: row.visible !== false,
        display_order: row.order ?? index + 1
      })),
      projects: (localData.projects || []).map((row, index) => ({
        id: row.id,
        title: row.title,
        label: row.label || "",
        description: row.description || "",
        contribution: row.contribution || "",
        tags: clone(row.tags || []),
        github: row.github || "",
        live: row.live || "",
        image: row.image || "",
        image_alt: row.imageAlt || "",
        image_width: row.imageWidth || null,
        image_height: row.imageHeight || null,
        featured: row.featured === true,
        visible: row.visible !== false,
        display_order: row.order ?? index + 1
      })),
      achievements: (localData.achievements || []).map((row, index) => ({
        id: row.id,
        group_key: row.group || "technical",
        rank: row.rank || "",
        title: row.title,
        category: row.category || "",
        description: row.description || "",
        primary: row.primary === true,
        image: row.image || "",
        image_alt: row.imageAlt || "",
        image_fit: row.imageFit || "cover",
        proof_images: clone(row.proofImages || []),
        visible: row.visible !== false,
        display_order: row.order ?? index + 1
      })),
      skills: (localData.skills || []).map((row, index) => ({
        id: row.id || slugify(row.title),
        category: row.title,
        skills: clone(row.items || []),
        wide: row.wide === true,
        visible: row.visible !== false,
        display_order: row.order ?? index + 1
      })),
      certifications: (localData.certifications || []).map((row, index) => ({
        id: row.id,
        title: row.title,
        issuer: row.issuer || "",
        type: row.type || "",
        description: row.description || "",
        tags: clone(row.tags || []),
        image: row.image || "",
        image_alt: row.imageAlt || "",
        image_width: row.imageWidth || null,
        image_height: row.imageHeight || null,
        link: row.link || "",
        visible: row.visible !== false,
        display_order: row.order ?? index + 1
      })),
      quotes: clone(window.DEFAULT_QUOTES || []),
      gallery: (localData.gallery || []).map((row, index) => ({
        id: row.id,
        title: row.title,
        caption: row.caption || "",
        src: row.src || "",
        alt: row.alt || "",
        type: row.type || "achievement",
        fit: row.fit || "cover",
        image_width: row.imageWidth || null,
        image_height: row.imageHeight || null,
        visible: row.visible !== false,
        display_order: row.order ?? index + 1
      })),
      coding_profiles: (localData.codingProfiles || []).map((row, index) => ({
        id: row.id,
        platform: row.platform,
        username: row.username || "",
        url: row.url || "",
        visible: row.visible !== false,
        display_order: row.order ?? index + 1
      }))
    };
  }

  function wireInterface() {
    $("#login-form").addEventListener("submit", signIn);
    $("#logout-button").addEventListener("click", signOut);
    $("#profile-form").addEventListener("submit", saveProfile);
    $("#contact-form").addEventListener("submit", saveContact);
    $("#refresh-analytics").addEventListener("click", loadAnalytics);

    $$(".admin-nav-link").forEach((button) => {
      button.addEventListener("click", () => showPanel(button.dataset.panel));
    });

    $("#sidebar-toggle").addEventListener("click", () => {
      const sidebar = $(".admin-sidebar");
      const open = sidebar.classList.toggle("open");
      $("#sidebar-toggle").setAttribute("aria-expanded", String(open));
    });
  }

  async function initialize() {
    wireInterface();
    state.client = await withTimeout(
      window.PortfolioSupabase?.ready,
      "Connecting to Supabase"
    );
    if (!state.client) {
      $("#setup-notice").hidden = false;
      $("#login-message").textContent =
        "Supabase is not configured. Follow ADMIN_GUIDE.md, then add the project URL and anon key.";
      $("#login-form button").disabled = true;
      return;
    }

    state.client.auth.onAuthStateChange((_event, session) => {
      if (!session && !$("#dashboard").hidden) showLogin();
    });

    const { data, error } = await withTimeout(
      state.client.auth.getSession(),
      "Checking the admin session"
    );
    if (error) $("#login-message").textContent = error.message;
    if (data?.session?.user) await openDashboard(data.session.user);
  }

  async function signIn(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = event.submitter;
    $("#login-message").textContent = "";
    setButtonLoading(button, true, "Signing in…");
    try {
      const { data, error } = await withTimeout(
        state.client.auth.signInWithPassword({
          email: form.elements.email.value.trim(),
          password: form.elements.password.value
        }),
        "Signing in"
      );
      if (error) {
        $("#login-message").textContent = error.message;
        return;
      }
      await openDashboard(data.user);
    } catch (error) {
      $("#login-message").textContent = errorMessage(error, "Sign-in failed.");
    } finally {
      setButtonLoading(button, false);
    }
  }

  async function signOut() {
    try {
      await withTimeout(state.client.auth.signOut(), "Signing out");
    } finally {
      showLogin();
    }
  }

  function showLogin() {
    state.user = null;
    $("#dashboard").hidden = true;
    $("#login-view").hidden = false;
  }

  async function openDashboard(user) {
    $("#login-message").textContent = "";
    const { data: allowed, error } = await withTimeout(
      state.client.rpc("is_portfolio_admin"),
      "Checking the admin allowlist"
    );
    if (error || !allowed) {
      await state.client.auth.signOut();
      showLogin();
      $("#login-message").textContent = error
        ? `Admin access check failed: ${error.message}`
        : "This account is signed in but is not on the portfolio admin allowlist.";
      return;
    }

    state.user = user;
    $("#login-view").hidden = true;
    $("#dashboard").hidden = false;
    $("#session-email").textContent = user.email || "Portfolio admin";
    setSync("Loading content…");

    try {
      await loadContent();
      populateFixedForms();
      renderCollections();
      await loadAnalytics();
      setSync("Connected · changes save to Supabase");
    } catch (contentError) {
      setSync("Setup incomplete");
      toast(contentError.message, "error");
    }
  }

  async function selectAll(table) {
    const { data, error } = await withTimeout(
      state.client.from(table).select("*"),
      `Loading ${table}`
    );
    if (error) throw new Error(`${table}: ${error.message}`);
    return data || [];
  }

  async function selectOptionalTable(table) {
    const { data, error } = await withTimeout(
      state.client.from(table).select("*"),
      `Loading ${table}`
    );
    if (!error) return { available: true, rows: data || [] };

    const missingTable =
      ["42P01", "PGRST205"].includes(error.code) ||
      /relation .* does not exist|schema cache/i.test(error.message || "");
    if (missingTable) return { available: false, rows: [] };
    throw new Error(`${table}: ${error.message}`);
  }

  async function selectSingleton(table, columns = "*") {
    const result = await withTimeout(
      state.client.from(table).select(columns).eq("id", "main").maybeSingle(),
      `Loading ${table}`
    );
    if (result.error) throw new Error(`${table}: ${result.error.message}`);
    return result.data;
  }

  async function loadContent() {
    const fallbacks = fallbackCollections();
    const [
      metaRow,
      linksRow,
      quoteRow,
      building,
      projects,
      achievements,
      skills,
      certifications,
      quoteLibrary,
      gallery,
      profiles
    ] = await Promise.all([
      selectSingleton("portfolio_meta", "content"),
      selectSingleton("portfolio_links", "content"),
      selectSingleton("portfolio_quote"),
      selectAll("currently_building"),
      selectAll("projects"),
      selectAll("achievements"),
      selectAll("skills"),
      selectAll("certifications"),
      selectOptionalTable("quotes"),
      selectAll("gallery"),
      selectAll("coding_profiles")
    ]);

    state.initialized = metaRow?.content?.supabase_initialized === true;
    state.meta = clone(metaRow?.content || fallbackMeta());
    if (state.meta.contact?.copyVersion !== localData.contact?.copyVersion) {
      state.meta.contact = clone(localData.contact || {});
    }
    state.quoteLibraryAvailable = quoteLibrary.available;
    state.quoteLibraryInitialized =
      state.meta.quote_library_initialized === true;
    state.quoteLibraryHasEntries =
      state.meta.quote_library_has_entries === true ||
      quoteLibrary.rows.length > 0;
    state.links = clone(linksRow?.content || localData.links || {});
    state.quote = clone(
      quoteRow || {
        id: "main",
        quote_text: localData.quote?.text || "",
        author: localData.quote?.author || "",
        context: localData.quote?.context || "",
        visible: localData.quote?.visible !== false
      }
    );
    state.collections = {
      currently_building: state.initialized ? building : building.length ? building : fallbacks.currently_building,
      projects: state.initialized ? projects : projects.length ? projects : fallbacks.projects,
      achievements: state.initialized ? achievements : achievements.length ? achievements : fallbacks.achievements,
      skills: state.initialized ? skills : skills.length ? skills : fallbacks.skills,
      certifications: state.initialized ? certifications : certifications.length ? certifications : fallbacks.certifications,
      quotes: state.quoteLibraryAvailable
        ? state.quoteLibraryInitialized
          ? quoteLibrary.rows
          : quoteLibrary.rows.length
            ? quoteLibrary.rows
            : fallbacks.quotes
        : [],
      gallery: state.initialized ? gallery : gallery.length ? gallery : fallbacks.gallery,
      coding_profiles: state.initialized ? profiles : profiles.length ? profiles : fallbacks.coding_profiles
    };
  }

  function populateFixedForms() {
    const profileForm = $("#profile-form");
    const profile = state.meta.profile || {};
    const hero = state.meta.hero || {};
    const cgpa = (state.meta.proofStrip || []).find((item) => item.id === "cgpa")?.value || "";
    const period = state.meta.education?.period || "";

    setFormValues(profileForm, {
      name: profile.name,
      location: profile.location,
      headline: hero.fullHeadline || localHeadline(),
      bio: hero.intro,
      cgpa,
      graduation_year: period,
      profile_photo: profile.photo,
      resume: state.links.resume || ""
    });

    const contactForm = $("#contact-form");
    const contact = state.meta.contact || localData.contact || {};
    const profileMap = Object.fromEntries(
      state.collections.coding_profiles.map((item) => [item.id, item])
    );
    const contactValues = {
      availability_label: contact.availabilityLabel || contact.eyebrow || "",
      status: contact.status || "",
      contact_headline:
        contact.headline ||
        [contact.titleBefore, contact.titleEmphasis].filter(Boolean).join(" "),
      contact_body: contact.body || contact.description || "",
      contact_chips: (contact.chips || []).join(", "),
      preferred_roles: (contact.preferredRoles || []).join(", "),
      contact_location: contact.location || state.meta.profile?.location || "",
      contact_visible: contact.visible !== false,
      email: String(state.links.email || "").replace(/^mailto:/, ""),
      portfolio_url: state.links.portfolio_url || state.links.portfolio || "",
      resume: state.links.resume || "",
      github: state.links.github || "",
      linkedin: state.links.linkedin || ""
    };
    ["leetcode", "codeforces", "codechef", "hackerrank"].forEach((id) => {
      contactValues[id] = profileMap[id]?.url || state.links[id] || "";
      contactValues[`${id}_username`] =
        profileMap[id]?.username || state.links[`${id}Username`] || "";
    });
    setFormValues(contactForm, contactValues);

  }

  function setFormValues(form, values) {
    Object.entries(values).forEach(([name, next]) => {
      const control = form.elements[name];
      if (!control) return;
      if (control.type === "checkbox") control.checked = Boolean(next);
      else control.value = next ?? "";
    });
  }

  async function saveProfile(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = event.submitter;
    setButtonLoading(button, true, "Saving…");
    setSync("Saving profile…");
    try {
      let photo = form.elements.profile_photo.value.trim();
      let resume = form.elements.resume.value.trim();
      const photoFile = form.elements.profile_photo_file.files[0];
      const resumeFile = form.elements.resume_file.files[0];
      if (photoFile) photo = await upload("profile", photoFile, "image");
      if (resumeFile) resume = await upload("resumes", resumeFile, "pdf");

      state.meta.profile = {
        ...(state.meta.profile || {}),
        name: form.elements.name.value.trim(),
        location: form.elements.location.value.trim(),
        photo
      };
      state.meta.hero = {
        ...(state.meta.hero || {}),
        fullHeadline: form.elements.headline.value.trim(),
        intro: form.elements.bio.value.trim()
      };
      state.meta.education = {
        ...(state.meta.education || {}),
        period: formatGraduation(form.elements.graduation_year.value.trim())
      };
      updateCgpa(form.elements.cgpa.value.trim());
      state.links.resume = resume;

      await ensureInitialized();
      await Promise.all([
        upsert("portfolio_meta", { id: "main", content: state.meta }),
        upsert("portfolio_links", { id: "main", content: state.links })
      ]);
      const [savedMeta, savedLinks] = await Promise.all([
        selectSingleton("portfolio_meta", "content"),
        selectSingleton("portfolio_links", "content")
      ]);
      state.meta = clone(savedMeta?.content || state.meta);
      state.links = clone(savedLinks?.content || state.links);
      populateFixedForms();
      form.elements.profile_photo_file.value = "";
      form.elements.resume_file.value = "";
      toast("Profile saved.");
      setSync("Profile saved");
    } catch (saveError) {
      toast(errorMessage(saveError, "Profile save failed."), "error");
      setSync("Save failed");
    } finally {
      setButtonLoading(button, false);
    }
  }

  function formatGraduation(value) {
    if (!value) return "";
    return /^\d{4}$/.test(value) ? `Expected graduation · ${value}` : value;
  }

  function updateCgpa(value) {
    const proof = [...(state.meta.proofStrip || [])];
    const proofIndex = proof.findIndex((item) => item.id === "cgpa");
    const item = { id: "cgpa", value, label: "CGPA", visible: true, order: 1 };
    if (proofIndex >= 0) proof[proofIndex] = { ...proof[proofIndex], value };
    else proof.unshift(item);
    state.meta.proofStrip = proof;

    const facts = [...(state.meta.education?.facts || [])];
    const factIndex = facts.findIndex((item) => item.label?.toLowerCase() === "cgpa");
    if (factIndex >= 0) facts[factIndex] = { ...facts[factIndex], value };
    else facts.unshift({ label: "CGPA", value });
    state.meta.education.facts = facts;
  }

  function commaList(value) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function validateEmail(value) {
    if (!value) return "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      throw new Error("Enter a valid contact email address.");
    }
    return value;
  }

  function validateHttpsUrl(value, label, options = {}) {
    if (!value) return "";
    if (options.allowRelative && !/^[a-z][a-z\d+.-]*:/i.test(value) && !value.startsWith("//")) {
      return value;
    }
    if (!value.startsWith("https://")) {
      throw new Error(`${label} must start with https://`);
    }
    try {
      return new URL(value).href;
    } catch {
      throw new Error(`${label} is not a valid URL.`);
    }
  }

  async function saveContact(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = event.submitter;
    setButtonLoading(button, true, "Saving…");
    setSync("Saving contact…");
    try {
      const email = validateEmail(form.elements.email.value.trim());
      const portfolio = validateHttpsUrl(
        form.elements.portfolio_url.value.trim(),
        "Portfolio URL"
      );
      const resume = validateHttpsUrl(
        form.elements.resume.value.trim(),
        "Resume URL",
        { allowRelative: true }
      );
      const github = validateHttpsUrl(
        form.elements.github.value.trim(),
        "GitHub URL"
      );
      const linkedin = validateHttpsUrl(
        form.elements.linkedin.value.trim(),
        "LinkedIn URL"
      );

      state.meta.contact = {
        ...(state.meta.contact || {}),
        copyVersion: 3,
        availabilityLabel: form.elements.availability_label.value.trim(),
        status: form.elements.status.value.trim(),
        headline: form.elements.contact_headline.value.trim(),
        body: form.elements.contact_body.value.trim(),
        chips: commaList(form.elements.contact_chips.value),
        preferredRoles: commaList(form.elements.preferred_roles.value),
        location: form.elements.contact_location.value.trim(),
        visible: form.elements.contact_visible.checked,
        note:
          state.meta.contact?.note ||
          localData.contact?.note ||
          ""
      };
      state.links = {
        ...state.links,
        email: email ? `mailto:${email}` : "",
        portfolio,
        portfolio_url: portfolio,
        resume,
        github,
        linkedin
      };

      const platforms = {
        leetcode: "LeetCode",
        codeforces: "Codeforces",
        codechef: "CodeChef",
        hackerrank: "HackerRank"
      };
      const rows = Object.entries(platforms).map(([id, platform], index) => {
        const url = validateHttpsUrl(
          form.elements[id].value.trim(),
          `${platform} URL`
        );
        const username = form.elements[`${id}_username`].value.trim();
        state.links[id] = url;
        state.links[`${id}Username`] = username;
        return {
          id,
          platform,
          username,
          url,
          visible: Boolean(url),
          display_order: index + 1
        };
      });

      await Promise.all([
        upsert("portfolio_meta", { id: "main", content: state.meta }),
        upsert("portfolio_links", { id: "main", content: state.links }),
        upsertMany("coding_profiles", rows)
      ]);
      const [savedMeta, savedLinks, savedProfiles] = await Promise.all([
        selectSingleton("portfolio_meta", "content"),
        selectSingleton("portfolio_links", "content"),
        selectAll("coding_profiles")
      ]);
      state.meta = clone(savedMeta?.content || state.meta);
      state.links = clone(savedLinks?.content || state.links);
      state.collections.coding_profiles = savedProfiles;
      populateFixedForms();
      toast("Contact content and routes saved.");
      setSync("Contact saved");
    } catch (saveError) {
      toast(errorMessage(saveError, "Contact save failed."), "error");
      setSync("Save failed");
    } finally {
      setButtonLoading(button, false);
    }
  }

  async function upsert(table, row) {
    const { error } = await withTimeout(
      state.client.from(table).upsert(row, { onConflict: "id" }),
      `Saving ${table}`
    );
    if (error) throw new Error(error.message);
  }

  async function upsertMany(table, rows) {
    if (!rows.length) return;
    const { error } = await withTimeout(
      state.client.from(table).upsert(rows, { onConflict: "id" }),
      `Saving ${table}`
    );
    if (error) throw new Error(error.message);
  }

  async function insertMany(table, rows) {
    if (!rows.length) return;
    const { error } = await withTimeout(
      state.client.from(table).insert(rows),
      `Inserting ${table}`
    );
    if (error) throw new Error(error.message);
  }

  async function ensureInitialized() {
    if (state.initialized) return;
    if (state.initializing) return state.initializing;

    state.initializing = (async () => {
      setSync("Publishing local portfolio to Supabase…");
      state.meta.supabase_initialized = true;
      try {
        const collectionWrites = Object.entries(state.collections)
          .filter(([table]) => table !== "quotes")
          .map(([table, rows]) => upsertMany(table, rows));
        await Promise.all([
          upsert("portfolio_meta", { id: "main", content: state.meta }),
          upsert("portfolio_links", { id: "main", content: state.links }),
          upsert("portfolio_quote", state.quote),
          ...collectionWrites
        ]);
        state.initialized = true;
        setSync("Supabase content initialized");
      } catch (error) {
        state.meta.supabase_initialized = false;
        throw new Error(`Initial content migration failed: ${error.message}`);
      } finally {
        state.initializing = null;
      }
    })();
    return state.initializing;
  }

  async function ensureQuoteLibraryInitialized() {
    if (!state.quoteLibraryAvailable) {
      throw new Error(
        "Quote Library is not installed. Run supabase/quote-library-migration.sql first."
      );
    }
    if (state.quoteLibraryInitialized) return;

    await ensureInitialized();
    const databaseQuotes = await selectAll("quotes");
    state.meta.quote_library_initialized = true;
    state.meta.quote_library_has_entries = databaseQuotes.length > 0;
    try {
      await upsert("portfolio_meta", { id: "main", content: state.meta });
      state.quoteLibraryInitialized = true;
      state.quoteLibraryHasEntries = databaseQuotes.length > 0;
    } catch (error) {
      state.meta.quote_library_initialized = false;
      throw new Error(`Quote Library initialization failed: ${error.message}`);
    }
  }

  async function prepareTableWrite(table) {
    if (table === "quotes") {
      await ensureQuoteLibraryInitialized();
    } else {
      await ensureInitialized();
    }
  }

  async function updateQuoteLibraryMarker(hasEntries) {
    state.meta.quote_library_initialized = true;
    state.meta.quote_library_has_entries = hasEntries;
    await upsert("portfolio_meta", { id: "main", content: state.meta });
    state.quoteLibraryInitialized = true;
    state.quoteLibraryHasEntries = hasEntries;
  }

  async function refreshCollection(table) {
    const rows = await selectAll(table);
    state.collections[table] = rows;
    if (table === "quotes") {
      await updateQuoteLibraryMarker(rows.length > 0);
    }
    renderCollection(table, configs[table]);
    return rows;
  }

  async function seedDefaultQuotes(button) {
    setButtonLoading(button, true, "Seeding…");
    try {
      await prepareTableWrite("quotes");
      const defaults = clone(window.DEFAULT_QUOTES || []);
      if (!defaults.length) throw new Error("The local default quote bank is unavailable.");

      const existing = await selectAll("quotes");
      const existingIds = new Set(existing.map((quote) => quote.id));
      const missing = defaults.filter((quote) => !existingIds.has(quote.id));
      await insertMany("quotes", missing);
      const rows = await refreshCollection("quotes");
      toast(
        missing.length
          ? `${missing.length} default quotes added. ${rows.length} quotes are now available.`
          : "Default quotes are already seeded; no duplicates were added."
      );
    } catch (error) {
      console.error("[Portfolio admin] Default quote seeding failed.", error);
      toast(errorMessage(error, "Default quote seeding failed."), "error");
    } finally {
      setButtonLoading(button, false);
    }
  }

  function setButtonLoading(button, loading, text) {
    if (!button) return;
    if (loading) {
      button.dataset.originalText = button.textContent;
      button.textContent = text;
      button.disabled = true;
    } else {
      button.textContent = button.dataset.originalText || button.textContent;
      button.disabled = false;
    }
  }

  function showPanel(panelName) {
    $$(".admin-panel").forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.adminPanel === panelName);
    });
    $$(".admin-nav-link").forEach((button) => {
      const current = button.dataset.panel === panelName;
      button.classList.toggle("active", current);
      button.setAttribute("aria-current", current ? "page" : "false");
    });
    $(".admin-sidebar").classList.remove("open");
    $("#sidebar-toggle").setAttribute("aria-expanded", "false");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderCollections() {
    Object.entries(configs).forEach(([table, config]) => renderCollection(table, config));
  }

  function renderCollection(table, config) {
    const mount = $(`[data-collection="${table}"]`);
    mount.replaceChildren();

    if (table === "quotes" && !state.quoteLibraryAvailable) {
      renderQuoteMigrationNotice(mount);
      return;
    }

    const heading = document.createElement("div");
    heading.className = "panel-heading";
    const headingText = document.createElement("div");
    const kicker = document.createElement("p");
    kicker.className = "admin-kicker";
    kicker.textContent = `content.${table}`;
    const title = document.createElement("h2");
    title.textContent = config.title;
    const description = document.createElement("p");
    description.className = "collection-description";
    description.textContent = config.description;
    headingText.append(kicker, title, description);
    const add = adminButton("Add item", "admin-button-primary");
    add.addEventListener("click", () => editRow(table, newRow(table, config)));
    const headingActions = document.createElement("div");
    headingActions.className = "panel-heading-actions";
    if (table === "quotes") {
      const seed = adminButton("Seed default quotes");
      seed.addEventListener("click", () => seedDefaultQuotes(seed));
      headingActions.append(seed);
    }
    headingActions.append(add);
    heading.append(headingText, headingActions);

    const layout = document.createElement("div");
    layout.className = "collection-layout";
    const list = document.createElement("div");
    list.className = "collection-list";
    const editor = document.createElement("div");
    editor.className = "editor-shell admin-card";
    editor.dataset.editor = table;

    const rows = [...(state.collections[table] || [])].sort(
      (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );
    if (!rows.length) {
      const empty = document.createElement("p");
      empty.textContent = "No items yet.";
      empty.className = "empty-state";
      list.append(empty);
    }
    rows.forEach((row) => list.append(collectionItem(table, config, row)));

    const selected = rows.find((row) => row.id === state.editing[table]);
    if (selected) renderEditor(table, config, selected, editor);
    else renderEditorPlaceholder(config, editor);

    layout.append(list, editor);
    mount.append(heading, layout);
  }

  function renderQuoteMigrationNotice(mount) {
    const heading = document.createElement("div");
    heading.className = "panel-heading";
    const copy = document.createElement("div");
    const kicker = document.createElement("p");
    kicker.className = "admin-kicker";
    kicker.textContent = "comment.rotation";
    const title = document.createElement("h2");
    title.textContent = "Quote Library";
    copy.append(kicker, title);
    heading.append(copy);

    const notice = document.createElement("article");
    notice.className = "admin-card migration-notice";
    const noticeTitle = document.createElement("h3");
    noticeTitle.textContent = "Migration required";
    const text = document.createElement("p");
    text.textContent =
      "Run supabase/quote-library-migration.sql in the Supabase SQL Editor, then reload this page. The legacy quote remains active until then.";
    notice.append(noticeTitle, text);
    mount.append(heading, notice);
  }

  function collectionItem(table, config, row) {
    const card = document.createElement("article");
    card.className = "collection-item";
    const header = document.createElement("div");
    header.className = "collection-item-header";
    const copy = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = config.label(row);
    const detail = document.createElement("p");
    detail.textContent = config.detail(row) || `Order ${row.display_order ?? 0}`;
    copy.append(title, detail);
    const badge = document.createElement("span");
    badge.className = `visibility-badge${row.visible === false ? " hidden-item" : ""}`;
    badge.textContent = row.visible === false ? "hidden" : "visible";
    header.append(copy, badge);

    const actions = document.createElement("div");
    actions.className = "collection-item-actions";
    const edit = adminButton("Edit", "admin-button-small");
    edit.addEventListener("click", () => editRow(table, row));
    const visibility = adminButton(row.visible === false ? "Show" : "Hide", "admin-button-small");
    visibility.addEventListener("click", () => toggleVisible(table, row));
    const remove = adminButton("Delete", "admin-button-small admin-button-danger");
    remove.addEventListener("click", () => deleteRow(table, config, row));
    actions.append(edit, visibility, remove);
    card.append(header, actions);
    return card;
  }

  function adminButton(text, classes = "") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `admin-button ${classes}`.trim();
    button.textContent = text;
    return button;
  }

  function newRow(table, config) {
    const row = {
      id: "",
      visible: true,
      display_order: (state.collections[table] || []).length + 1
    };
    config.fields.forEach((item) => {
      if (item.type === "csv" || item.type === "json") row[item.name] = [];
      if (item.type === "checkbox" && row[item.name] === undefined) row[item.name] = false;
      if (item.type === "select") row[item.name] = item.options[0];
    });
    row.visible = true;
    return row;
  }

  function editRow(table, row) {
    state.editing[table] = row.id || "__new__";
    renderCollection(table, configs[table]);
    const editor = $(`[data-editor="${table}"]`);
    renderEditor(table, configs[table], row, editor);
    editor.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function renderEditorPlaceholder(config, mount) {
    const title = document.createElement("h3");
    title.textContent = `Edit ${config.title.toLowerCase()}`;
    const copy = document.createElement("p");
    copy.textContent = "Select an item or add a new one.";
    mount.append(title, copy);
  }

  function renderEditor(table, config, row, mount) {
    mount.replaceChildren();
    const form = document.createElement("form");
    form.className = "admin-form";
    form.dataset.originalId = row.id || "";

    const toolbar = document.createElement("div");
    toolbar.className = "editor-toolbar";
    const title = document.createElement("h3");
    title.textContent = row.id ? `Edit ${config.label(row)}` : "Add item";
    const cancel = adminButton("Cancel", "admin-button-small");
    cancel.addEventListener("click", () => {
      delete state.editing[table];
      renderCollection(table, config);
    });
    toolbar.append(title, cancel);

    const grid = document.createElement("div");
    grid.className = "form-grid";
    config.fields.forEach((item) => grid.append(buildField(item, row)));

    const actions = document.createElement("div");
    actions.className = "editor-actions";
    const save = adminButton("Save item", "admin-button-primary");
    save.type = "submit";
    actions.append(save);
    form.append(toolbar, grid, actions);
    form.addEventListener("submit", (event) => saveRow(event, table, config));
    mount.append(form);
  }

  function buildField(config, row) {
    const label = document.createElement("label");
    if (config.full) label.classList.add("full");
    if (config.type === "checkbox") label.classList.add("toggle-label");
    if (config.type === "file") label.classList.add("upload-field");

    const caption = document.createElement("span");
    caption.textContent = config.label;
    let input;
    if (config.type === "textarea" || config.type === "json") {
      input = document.createElement("textarea");
      input.rows = config.type === "json" ? 6 : 4;
    } else if (config.type === "select") {
      input = document.createElement("select");
      config.options.forEach((optionValue) => {
        const option = document.createElement("option");
        option.value = optionValue;
        option.textContent = optionValue;
        input.append(option);
      });
    } else {
      input = document.createElement("input");
      input.type = config.type === "csv" ? "text" : config.type;
    }
    input.name = config.name;
    input.dataset.valueType = config.type;
    if (config.required) input.required = true;
    if (config.accept) input.accept = config.accept;
    if (config.multiple) input.multiple = true;
    if (config.target) input.dataset.target = config.target;
    if (config.type === "number") input.min = "0";

    if (config.type === "checkbox") {
      input.checked = Boolean(row[config.name]);
      label.append(input, caption);
    } else {
      if (config.type === "csv") {
        input.value = Array.isArray(row[config.name])
          ? row[config.name].join(", ")
          : row[config.name] || "";
      } else if (config.type === "json") {
        input.value = JSON.stringify(row[config.name] || [], null, 2);
      } else if (config.type !== "file") {
        input.value = row[config.name] ?? "";
      }
      label.append(caption, input);
    }
    if (config.help) {
      const help = document.createElement("small");
      help.textContent = config.help;
      label.append(help);
    }
    return label;
  }

  async function saveRow(event, table, config) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = event.submitter;
    setButtonLoading(button, true, "Saving…");
    try {
      const row = {};
      for (const fieldConfig of config.fields) {
        const control = form.elements[fieldConfig.name];
        if (!control || fieldConfig.type === "file") continue;
        if (fieldConfig.type === "checkbox") row[fieldConfig.name] = control.checked;
        else if (fieldConfig.type === "number") row[fieldConfig.name] = Number(control.value || 0);
        else if (fieldConfig.type === "csv") {
          row[fieldConfig.name] = control.value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        } else if (fieldConfig.type === "json") {
          try {
            row[fieldConfig.name] = control.value.trim()
              ? JSON.parse(control.value)
              : [];
          } catch {
            throw new Error(`${fieldConfig.label} must be valid JSON.`);
          }
        } else row[fieldConfig.name] = control.value.trim();
      }

      row.id = slugify(row.id || row.title || row.category);
      if (!row.id) throw new Error("A stable ID is required.");
      if (form.dataset.originalId && form.dataset.originalId !== row.id) {
        throw new Error("An existing ID cannot be renamed. Add a new item instead.");
      }

      for (const fileField of config.fields.filter((item) => item.type === "file")) {
        const files = [...(form.elements[fileField.name]?.files || [])];
        if (!files.length) continue;
        const urls = [];
        for (const file of files) urls.push(await upload(config.bucket, file, "image"));
        if (fileField.target === "proof_images") {
          const existing = Array.isArray(row.proof_images) ? row.proof_images : [];
          row.proof_images = [
            ...existing,
            ...urls.map((src) => ({
              src,
              alt: `${row.title || "Achievement"} proof`,
              fit: "contain"
            }))
          ];
        } else {
          row[fileField.target] = urls[0];
        }
      }

      await prepareTableWrite(table);
      await upsert(table, row);
      state.editing[table] = row.id;
      await refreshCollection(table);
      toast(`${config.label(row)} saved.`);
    } catch (saveError) {
      toast(errorMessage(saveError, `${config.title} save failed.`), "error");
    } finally {
      setButtonLoading(button, false);
    }
  }

  async function toggleVisible(table, row) {
    const next = { ...row, visible: row.visible === false };
    try {
      await prepareTableWrite(table);
      await upsert(table, next);
      await refreshCollection(table);
      toast(`${configs[table].label(next)} is ${next.visible ? "visible" : "hidden"}.`);
    } catch (error) {
      toast(errorMessage(error, "Visibility update failed."), "error");
    }
  }

  async function deleteRow(table, config, row) {
    const itemLabel = config.label(row);
    if (!window.confirm(`Delete “${itemLabel}”? This cannot be undone.`)) return;
    try {
      await prepareTableWrite(table);
    } catch (error) {
      console.error("[Portfolio admin] Delete preparation failed.", {
        table,
        id: row.id,
        error
      });
      toast(`Could not prepare deletion: ${error.message}`, "error");
      return;
    }

    try {
      const { data, error } = await withTimeout(
        state.client
          .from(table)
          .delete()
          .eq("id", row.id)
          .select("id"),
        `Deleting ${table}`
      );
      if (error) throw error;
      if (!(data || []).some((deleted) => deleted.id === row.id)) {
        throw new Error(
          "No matching row was deleted. Check the item ID and Supabase delete RLS policy."
        );
      }
    } catch (error) {
      console.error("[Portfolio admin] Database deletion failed.", {
        table,
        id: row.id,
        error
      });
      toast(`Could not delete ${itemLabel}: ${error.message}`, "error");
      return;
    }

    delete state.editing[table];
    await refreshCollection(table);

    const cleanup = await removeAssets(config, row);
    if (cleanup.error) {
      console.warn("[Portfolio admin] Database row deleted, but Storage cleanup failed.", {
        table,
        id: row.id,
        paths: cleanup.paths,
        error: cleanup.error
      });
      toast(
        `${itemLabel} deleted. Its database row is gone, but Storage cleanup needs attention.`,
        "warning"
      );
      return;
    }
    toast(`${itemLabel} deleted.`);
  }

  async function upload(bucket, file, expected) {
    const imageTypes = ["image/jpeg", "image/png", "image/webp"];
    const isImage = imageTypes.includes(file.type);
    const isPdf = file.type === "application/pdf";
    if (expected === "image" && !isImage) {
      throw new Error(`${file.name} must be a JPG, PNG, or WebP image.`);
    }
    if (expected === "pdf" && !isPdf) {
      throw new Error(`${file.name} must be a PDF.`);
    }
    const maximum =
      expected === "pdf"
        ? 10 * 1024 * 1024
        : bucket === "profile"
          ? 5 * 1024 * 1024
          : 8 * 1024 * 1024;
    if (file.size > maximum) {
      throw new Error(`${file.name} exceeds the ${maximum / 1024 / 1024} MB limit.`);
    }
    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = `${state.user.id}/${Date.now()}-${safeName}`;
    const { error } = await withTimeout(
      state.client.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        contentType: file.type,
        upsert: false
      }),
      `Uploading ${file.name}`,
      UPLOAD_TIMEOUT
    );
    if (error) {
      throw new Error(
        `Upload failed for ${file.name}: ${error.message}. Check the ${bucket} bucket and its RLS policies.`
      );
    }
    return state.client.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  async function removeAssets(config, row) {
    if (!config.bucket || !config.assets) {
      return { paths: [], removed: [], error: null };
    }
    const urls = [];
    config.assets.forEach((key) => {
      if (typeof row[key] === "string") urls.push(row[key]);
      if (Array.isArray(row[key])) {
        row[key].forEach((item) => urls.push(typeof item === "string" ? item : item?.src));
      }
    });
    const paths = urls
      .map((url) => storagePath(url, config.bucket))
      .filter(Boolean);
    if (!paths.length) return { paths: [], removed: [], error: null };

    try {
      const { data, error } = await withTimeout(
        state.client.storage.from(config.bucket).remove(paths),
        `Removing files from ${config.bucket}`
      );
      return { paths, removed: data || [], error: error || null };
    } catch (error) {
      return { paths, removed: [], error };
    }
  }

  function storagePath(url, bucket) {
    try {
      const parsedUrl = new URL(url);
      const projectOrigin = new URL(window.SUPABASE_CONFIG?.url || "").origin;
      if (parsedUrl.origin !== projectOrigin) return "";

      const path = parsedUrl.pathname;
      const markers = [
        `/storage/v1/object/public/${bucket}/`,
        `/storage/v1/render/image/public/${bucket}/`
      ];
      for (const marker of markers) {
        const index = path.indexOf(marker);
        if (index >= 0) {
          return decodeURIComponent(path.slice(index + marker.length));
        }
      }
      return "";
    } catch {
      return "";
    }
  }

  async function loadAnalytics() {
    if (!state.user) return;
    const button = $("#refresh-analytics");
    setButtonLoading(button, true, "Refreshing…");
    try {
      const [summaryResult, recentResult] = await withTimeout(
        Promise.all([
          state.client.rpc("get_visit_summary"),
          state.client
            .from("site_visits")
            .select("created_at,event_type,page_path,device_type,referrer")
            .order("created_at", { ascending: false })
            .limit(20)
        ]),
        "Loading analytics"
      );
      if (summaryResult.error) throw new Error(summaryResult.error.message);
      if (recentResult.error) throw new Error(recentResult.error.message);
      renderAnalytics(summaryResult.data || {}, recentResult.data || []);
    } catch (error) {
      toast(`Analytics: ${error.message}`, "error");
    } finally {
      setButtonLoading(button, false);
    }
  }

  function renderAnalytics(summary, visits) {
    const stats = [
      ["Total visits", summary.total_visits || 0],
      ["Unique visitors", summary.unique_visitors || 0],
      ["Today", summary.today_visits || 0],
      ["Last 7 days", summary.last_7_days || 0],
      ["Top page", summary.top_page || "—"],
      ["Top section", summary.top_section || "—"]
    ];
    const cards = $("#analytics-cards");
    cards.replaceChildren();
    stats.forEach(([labelText, result]) => {
      const card = document.createElement("article");
      card.className = "analytics-stat";
      const label = document.createElement("span");
      label.textContent = labelText;
      const value = document.createElement("strong");
      value.textContent = String(result);
      card.append(label, value);
      cards.append(card);
    });

    const devices = $("#device-breakdown");
    devices.replaceChildren();
    const breakdown = summary.device_breakdown || {};
    if (!Object.keys(breakdown).length) devices.textContent = "No device data yet.";
    Object.entries(breakdown)
      .sort((a, b) => b[1] - a[1])
      .forEach(([device, count]) => {
        const row = document.createElement("div");
        row.className = "device-row";
        const name = document.createElement("span");
        name.textContent = device;
        const total = document.createElement("strong");
        total.textContent = String(count);
        row.append(name, total);
        devices.append(row);
      });

    const body = $("#recent-visits");
    body.replaceChildren();
    if (!visits.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 5;
      cell.textContent = "No analytics events yet.";
      row.append(cell);
      body.append(row);
      return;
    }
    visits.forEach((visit) => {
      const row = document.createElement("tr");
      [
        new Date(visit.created_at).toLocaleString(),
        visit.event_type,
        visit.page_path,
        visit.device_type,
        visit.referrer || "direct"
      ].forEach((text) => {
        const cell = document.createElement("td");
        cell.textContent = text || "—";
        row.append(cell);
      });
      body.append(row);
    });
  }

  initialize().catch((error) => {
    $("#login-message").textContent = error.message || "Admin initialization failed.";
  });
})();
