(function initializeAnonymousAnalytics() {

  const VISITOR_KEY = "portfolio_anonymous_visitor_id";
  const SESSION_KEY = "portfolio_pageview_recorded";
  const seenSections = new Set();

  function randomId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function getVisitorId() {
    try {
      let value = localStorage.getItem(VISITOR_KEY);
      if (!value) {
        value = randomId();
        localStorage.setItem(VISITOR_KEY, value);
      }
      return value;
    } catch {
      return randomId();
    }
  }

  function getDeviceType() {
    const width = window.innerWidth;
    if (width < 700) return "mobile";
    if (width < 1024) return "tablet";
    return "desktop";
  }

  function safeReferrer() {
    if (!document.referrer) return "";
    try {
      const url = new URL(document.referrer);
      return url.origin === window.location.origin ? "internal" : url.hostname;
    } catch {
      return "";
    }
  }

  async function record(client, eventType, pagePath) {
    try {
      await client.from("site_visits").insert({
        visitor_id: getVisitorId(),
        event_type: eventType,
        page_path: pagePath.slice(0, 250),
        referrer: safeReferrer().slice(0, 250),
        device_type: getDeviceType(),
        user_agent_optional: null
      });
    } catch {
      // Analytics must never interfere with the public portfolio.
    }
  }

  async function start() {
    const client = await window.PortfolioSupabase?.ready;
    if (!client) return;

    try {
      if (!sessionStorage.getItem(SESSION_KEY)) {
        sessionStorage.setItem(SESSION_KEY, "true");
        record(client, "pageview", `${location.pathname}${location.search}`);
      }
    } catch {
      record(client, "pageview", `${location.pathname}${location.search}`);
    }

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || seenSections.has(entry.target.id)) return;
          seenSections.add(entry.target.id);
          record(client, "section_view", `${location.pathname}#${entry.target.id}`);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.55 }
    );

    document
      .querySelectorAll("main section[id]:not([hidden])")
      .forEach((section) => observer.observe(section));
  }

  if (document.documentElement.dataset.portfolioReady === "true") {
    start();
  } else if (document.readyState === "loading") {
    document.addEventListener("portfolio:ready", start, { once: true });
  } else {
    start();
  }
})();
