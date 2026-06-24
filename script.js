let data = window.PORTFOLIO_DATA;

const byId = (id) => document.getElementById(id);
const visibleByOrder = (items = []) =>
  items
    .filter((item) => item && item.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function appendText(parent, text) {
  if (text) parent.append(document.createTextNode(text));
}

function isExternalLink(href = "") {
  return /^https?:\/\//i.test(href);
}

function resolveLink(item) {
  if (!item) return "";
  return item.href || data.links?.[item.linkKey] || "";
}

function configureLink(link, href, options = {}) {
  link.href = href;
  if (options.download) link.setAttribute("download", "");
  if (isExternalLink(href)) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  if (options.ariaLabel) link.setAttribute("aria-label", options.ariaLabel);
  return link;
}

function createSafeImage(config, onFailure) {
  if (!config?.src) return null;

  const image = document.createElement("img");
  image.alt = config.alt || "";
  image.loading = config.loading || "lazy";
  image.decoding = "async";
  image.className = config.className || "";

  if (config.width) image.width = config.width;
  if (config.height) image.height = config.height;
  if (config.fit) image.dataset.fit = config.fit;

  image.addEventListener(
    "load",
    () => {
      image.classList.add("image-loaded");
    },
    { once: true }
  );

  image.addEventListener(
    "error",
    () => {
      image.remove();
      if (onFailure) onFailure();
    },
    { once: true }
  );

  image.src = config.src;
  return image;
}

function createTagList(tags = [], ariaLabel = "") {
  const list = element("ul", "tag-list");
  if (ariaLabel) list.setAttribute("aria-label", ariaLabel);
  tags.filter(Boolean).forEach((tag) => list.append(element("li", "", tag)));
  return list;
}

function createSectionHeading(config) {
  const fragment = document.createDocumentFragment();
  const titleGroup = element("div");
  titleGroup.append(element("p", "eyebrow", config.eyebrow));

  const title = element("h2");
  appendText(title, `${config.titleBefore} `);
  title.append(element("span", "", config.titleEmphasis));
  titleGroup.append(title);

  fragment.append(titleGroup, element("p", "", config.description));
  return fragment;
}

function renderSiteMetadata() {
  if (data.site?.title) document.title = data.site.title;
  const description = document.querySelector('meta[name="description"]');
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDescription = document.querySelector('meta[property="og:description"]');

  if (description && data.site?.description) {
    description.content = data.site.description;
  }
  if (ogTitle && data.site?.title) ogTitle.content = data.site.title;
  if (ogDescription && data.site?.description) {
    ogDescription.content = data.site.description;
  }
}

function renderNavigation() {
  const logo = byId("nav-logo");
  logo.textContent = data.profile.name;
  logo.setAttribute("aria-label", `${data.profile.name}, portfolio home`);

  const resumeItem = byId("nav-resume-item");
  const resume = data.links?.resume;
  if (!resume) {
    resumeItem.remove();
    return;
  }

  const resumeLink = configureLink(
    element("a", "nav-resume", "Resume"),
    resume,
    { download: true }
  );
  resumeItem.append(resumeLink);
}

function renderHero() {
  const mount = byId("hero-content");
  const eyebrow = element("p", "eyebrow hero-eyebrow");
  const dot = element("span", "status-dot");
  dot.setAttribute("aria-hidden", "true");
  eyebrow.append(dot, document.createTextNode(data.hero.eyebrow));

  const headline = element("h1");
  if (data.hero.fullHeadline) {
    headline.textContent = data.hero.fullHeadline;
  } else {
    appendText(headline, `${data.hero.headlineBefore} `);
    headline.append(element("span", "", data.hero.headlineEmphasis));
    appendText(headline, ` ${data.hero.headlineAfter}`);
  }

  const intro = element("p", "hero-intro", data.hero.intro);
  const actions = element("div", "hero-actions");
  actions.setAttribute("aria-label", "Portfolio actions");

  data.hero.actions
    .filter((action) => action.visible !== false && resolveLink(action))
    .forEach((action) => {
      const link = configureLink(
        element("a", `btn btn-${action.style || "ghost"}`, action.label),
        resolveLink(action),
        {
          download: action.download,
          ariaLabel: isExternalLink(resolveLink(action))
            ? `${action.label} profile for ${data.profile.name}`
            : ""
        }
      );
      actions.append(link);
    });

  mount.append(
    eyebrow,
    headline,
    intro,
    actions,
    element("p", "hero-role-line", data.hero.roleLine)
  );
}

function renderProfile() {
  const mount = byId("profile-card");

  const topline = element("div", "profile-topline");
  const status = element("span", "profile-status", "available");
  topline.append(
    element("span", "", "workspace.profile"),
    status
  );

  const avatar = element("div", "profile-avatar");
  const fallback = element(
    "span",
    "profile-avatar-fallback",
    data.profile.fallbackInitials || ""
  );
  fallback.setAttribute("aria-hidden", "true");
  avatar.append(fallback);

  if (data.profile.photo) {
    const photo = createSafeImage(
      {
        src: data.profile.photo,
        alt: data.profile.alt,
        loading: "eager",
        className: "profile-photo"
      },
      () => avatar.classList.remove("has-photo")
    );

    if (photo) {
      photo.addEventListener(
        "load",
        () => avatar.classList.add("has-photo"),
        { once: true }
      );
      avatar.append(photo);
    }
  }

  const identity = element("div", "profile-identity");
  const identityCopy = element("div", "profile-identity-copy");
  identityCopy.append(
    element("h2", "", data.profile.name),
    element("p", "", `${data.profile.role} · ${data.profile.location}`)
  );
  identity.append(avatar, identityCopy);

  const terminal = element("div", "profile-terminal");
  terminal.setAttribute("aria-label", "Current engineering focus");
  terminal.append(
    element("p", "terminal-bar", "trupti@portfolio:~/workspace"),
    element("p", "terminal-line", "$ focus --secure-systems"),
    element("p", "terminal-output", "java_backend  graph_algorithms  applied_ai")
  );

  const details = element("dl", "profile-details");
  data.profile.details.forEach((detail) => {
    const row = element("div");
    row.append(
      element("dt", "", detail.label),
      element("dd", "", detail.value)
    );
    details.append(row);
  });

  const graph = element("div", "profile-graph");
  graph.setAttribute("aria-hidden", "true");
  ["api", "auth", "graph", "ml", "ui"].forEach((name, index) => {
    const node = element("span", `graph-node graph-node-${index + 1}`, name);
    graph.append(node);
  });
  graph.append(
    element("i", "graph-edge graph-edge-1"),
    element("i", "graph-edge graph-edge-2"),
    element("i", "graph-edge graph-edge-3"),
    element("i", "graph-edge graph-edge-4")
  );

  mount.append(
    topline,
    identity,
    terminal,
    details,
    graph
  );
}

function renderProofStrip() {
  const mount = byId("proof-strip");
  const items = visibleByOrder(data.proofStrip);

  items.forEach((item) => {
    const card = element("div", "proof-item");
    card.append(
      element("strong", "", item.value),
      element("span", "", item.label)
    );
    mount.append(card);
  });

  if (!items.length) mount.hidden = true;
}

function renderCurrentlyBuilding() {
  const mount = byId("currently-building-grid");
  const items = visibleByOrder(data.currentlyBuilding);

  items.forEach((item, index) => {
    const card = element("article", "building-card");
    card.dataset.buildingId = item.id;

    const meta = element("div", "building-meta");
    meta.append(
      element("span", "building-index", `queue/${String(index + 1).padStart(2, "0")}`),
      element("span", "building-live", "active")
    );

    const titleRow = element("div", "building-title-row");
    titleRow.append(
      element("h3", "", item.title),
      element("span", "building-status", item.status)
    );

    card.append(
      meta,
      titleRow,
      element("p", "building-description", item.description),
      createTagList(item.tags, `${item.title} topics`)
    );
    mount.append(card);
  });

  if (!items.length) byId("currently-building").hidden = true;
}

function renderQuote() {
  if (!data.quote?.visible || !data.quote.text) {
    byId("quote").hidden = true;
    return;
  }

  const mount = byId("motivation-quote");
  const label = element("p", "quote-label", "// build principle");
  const quote = element("blockquote", "", data.quote.text);
  const caption = element("figcaption");
  caption.append(
    element("cite", "", data.quote.author),
    element("span", "", data.quote.context)
  );
  mount.append(label, quote, caption);
}

function createOptionalMedia(config, className, onEmpty) {
  if (!config?.src) return null;

  const wrapper = element("div", className);
  const image = createSafeImage(config, () => {
    wrapper.remove();
    if (onEmpty) onEmpty();
  });
  if (!image) return null;
  wrapper.append(image);
  return wrapper;
}

function renderProjects() {
  const mount = byId("projects-grid");
  const projects = visibleByOrder(data.projects);

  projects.forEach((project, index) => {
    const card = element(
      "article",
      `project-card${project.featured ? " project-featured" : ""}`
    );
    card.dataset.projectId = project.id;

    const rail = element("div", "project-rail");
    rail.append(
      element("span", "project-index", String(index + 1).padStart(2, "0")),
      element("span", "project-rail-line"),
      element("span", "project-rail-type", project.featured ? "case study" : "build")
    );

    const body = element("div", "project-body");
    const header = element("div", "project-header");
    header.append(element("span", "project-label", project.label));
    body.append(
      header,
      element("h3", "", project.title),
      element("p", "project-description", project.description)
    );

    if (project.contribution) {
      const contribution = element("p", "project-contribution");
      contribution.append(
        element("span", "", "My contribution"),
        document.createTextNode(project.contribution)
      );
      body.append(contribution);
    }

    body.append(createTagList(project.tags, `${project.title} technologies`));

    const links = element("div", "project-links");
    [
      { href: project.github, label: "Source", type: "GitHub" },
      { href: project.live, label: "Live system", type: "live demo" }
    ]
      .filter((link) => link.href)
      .forEach((linkData) => {
        const link = configureLink(
          element("a", "project-link"),
          linkData.href,
          { ariaLabel: `${linkData.label} for ${project.title}` }
        );
        link.append(
          document.createTextNode(linkData.label),
          element("span", "", "↗")
        );
        link.lastElementChild.setAttribute("aria-hidden", "true");
        links.append(link);
      });
    if (links.childElementCount) body.append(links);

    const media = createOptionalMedia(
      {
        src: project.image,
        alt: project.imageAlt || `${project.title} project preview`,
        width: project.imageWidth,
        height: project.imageHeight,
        fit: "cover",
        className: "project-image"
      },
      "project-media"
    );
    let visual = media;
    if (!visual && project.featured) {
      visual = element("div", `project-schematic project-schematic-${project.id}`);
      visual.setAttribute("aria-hidden", "true");
      visual.append(
        element("span", "schematic-label", project.id === "shadowtrace" ? "threat_graph.map" : "compliance.pipeline"),
        element("i", "schematic-node schematic-node-a"),
        element("i", "schematic-node schematic-node-b"),
        element("i", "schematic-node schematic-node-c"),
        element("i", "schematic-node schematic-node-d"),
        element("i", "schematic-link schematic-link-a"),
        element("i", "schematic-link schematic-link-b"),
        element("i", "schematic-link schematic-link-c")
      );
    }

    card.append(rail, body);
    if (visual) card.append(visual);
    mount.append(card);
  });

  if (!projects.length) byId("projects").hidden = true;
}

function renderSkills() {
  const mount = byId("skills-grid");
  const groups = visibleByOrder(data.skills);

  groups.forEach((group) => {
    const card = element(
      "article",
      `skill-group${group.wide ? " skill-group-wide" : ""}`
    );
    const list = element("ul", "skill-list");
    group.items.filter(Boolean).forEach((item) => list.append(element("li", "", item)));
    card.dataset.skillIndex = String(group.order).padStart(2, "0");
    const heading = element("div", "skill-heading");
    heading.append(
      element("span", "skill-index", String(group.order).padStart(2, "0")),
      element("h3", "", group.title)
    );
    card.append(heading, list);
    mount.append(card);
  });

  if (!groups.length) byId("skills").hidden = true;
}

function renderCodingProfiles() {
  const section = byId("coding-profiles");
  const mount = byId("coding-profiles-list");
  const profiles = visibleByOrder(data.codingProfiles).filter(
    (profile) => profile.url
  );

  if (!profiles.length) {
    section.hidden = true;
    return;
  }

  const heading = byId("coding-profiles-heading");
  heading.append(
    element("p", "eyebrow", "profiles.index"),
    element("h2", "", "Coding profiles"),
    element("p", "", "Practice and competitive-programming handles.")
  );

  profiles.forEach((profile) => {
    const link = configureLink(
      element("a", "coding-profile"),
      profile.url,
      { ariaLabel: `${profile.platform} profile for ${data.profile.name}` }
    );
    const identity = element("span", "coding-profile-identity");
    identity.append(
      element("strong", "", profile.platform),
      profile.username ? element("small", "", profile.username) : ""
    );
    link.append(
      identity,
      element("span", "coding-profile-arrow", "↗")
    );
    mount.append(link);
  });
}

function renderEducation() {
  if (!data.education?.visible) {
    byId("education").hidden = true;
    return;
  }

  const mount = byId("education-grid");
  const copy = element("div", "education-copy reveal");
  copy.append(element("p", "eyebrow", data.education.eyebrow));

  const title = element("h2");
  appendText(title, `${data.education.titleBefore} `);
  title.append(element("span", "", data.education.titleEmphasis));
  copy.append(title);
  data.education.paragraphs.forEach((paragraph) =>
    copy.append(element("p", "", paragraph))
  );

  const card = element("article", "education-card reveal");
  card.append(
    element("p", "education-period", data.education.period),
    element("h3", "", data.education.degree),
    element("p", "education-college", data.education.institution)
  );

  const facts = element("div", "education-meta");
  data.education.facts.forEach((fact) => {
    const item = element("div");
    item.append(
      element("span", "", fact.label),
      element("strong", "", fact.value)
    );
    facts.append(item);
  });
  card.append(facts);
  mount.append(copy, card);
}

function normalizeProofImage(image, achievementTitle) {
  if (typeof image === "string") {
    return {
      src: image,
      alt: `${achievementTitle} proof image`,
      fit: "contain"
    };
  }
  return image;
}

function createAchievementProof(achievement) {
  const proofImages = (achievement.proofImages || [])
    .map((image) => normalizeProofImage(image, achievement.title))
    .filter((image) => image?.src);

  if (!proofImages.length) return null;

  const details = element("details", "achievement-proof");
  const summary = element(
    "summary",
    "",
    `View proof images (${proofImages.length})`
  );
  const gallery = element("div", "achievement-gallery");

  proofImages.forEach((proof, index) => {
    const figure = element("figure", "achievement-proof-item");
    const image = createSafeImage(
      {
        src: proof.src,
        alt: proof.alt || `${achievement.title} proof image ${index + 1}`,
        width: proof.width,
        height: proof.height,
        fit: proof.fit || "contain",
        className: "achievement-proof-image"
      },
      () => {
        figure.remove();
        if (!gallery.childElementCount) details.remove();
      }
    );
    if (image) {
      figure.append(image);
      gallery.append(figure);
    }
  });

  if (!gallery.childElementCount) return null;
  details.append(summary, gallery);
  return details;
}

function renderAchievements() {
  const groupsMount = byId("achievement-groups");
  const groups = visibleByOrder(data.achievementGroups);
  const achievements = visibleByOrder(data.achievements);

  groups.forEach((group) => {
    const groupAchievements = achievements.filter(
      (achievement) => achievement.group === group.id
    );
    if (!groupAchievements.length) return;

    const wrapper = element("div", "achievement-group reveal");
    const heading = element("div", "group-heading");
    heading.append(
      element("span", "", group.marker),
      element("h3", "", group.title)
    );

    const grid = element(
      "div",
      `achievement-grid${
        group.id === "leadership" ? " achievement-grid-secondary" : ""
      }`
    );

    groupAchievements.forEach((achievement, index) => {
      const card = element(
        "article",
        `achievement-card${achievement.primary ? " achievement-primary" : ""}`
      );

      const media = createOptionalMedia(
        {
          src: achievement.image,
          alt: achievement.imageAlt || achievement.title,
          fit: achievement.imageFit || "cover",
          className: "achievement-image"
        },
        "achievement-media"
      );
      if (media) card.append(media);

      const evidenceMeta = element("div", "achievement-meta");
      evidenceMeta.append(
        element("span", "achievement-code", `evidence/${String(index + 1).padStart(2, "0")}`),
        element("span", "achievement-verified", "verified")
      );

      card.append(
        evidenceMeta,
        element("p", "achievement-rank", achievement.rank),
        element("h4", "", achievement.title),
        element("p", "achievement-description", achievement.description)
      );

      const proof = createAchievementProof(achievement);
      if (proof) card.append(proof);
      grid.append(card);
    });

    wrapper.append(heading, grid);
    groupsMount.append(wrapper);
  });

  if (!groupsMount.childElementCount) byId("achievements").hidden = true;
}

function renderCertifications() {
  const mount = byId("certifications-grid");
  const certifications = visibleByOrder(data.certifications);

  certifications.forEach((certification) => {
    const card = element("article", "cert-card");
    const media = createOptionalMedia(
      {
        src: certification.image,
        alt: certification.imageAlt || `${certification.title} certificate`,
        width: certification.imageWidth,
        height: certification.imageHeight,
        fit: "contain",
        className: "cert-image"
      },
      "cert-media",
      () => card.classList.add("cert-card-text-only")
    );
    if (media) card.append(media);

    const content = element("div", "cert-content");
    content.append(
      element("p", "cert-type", certification.type),
      element("h3", "", certification.title),
      element("p", "", certification.description),
      createTagList(certification.tags, `${certification.title} topics`)
    );
    card.append(content);
    mount.append(card);
  });

  if (!certifications.length) byId("certifications").hidden = true;
}

function renderGallery() {
  const section = byId("gallery");
  const mount = byId("gallery-grid");
  const items = visibleByOrder(data.gallery).filter((item) => item.src);

  if (!items.length) {
    section.hidden = true;
    return;
  }

  const hideIfEmpty = () => {
    if (!mount.childElementCount) section.hidden = true;
  };

  items.forEach((item) => {
    const card = element("details", "gallery-card");
    const summary = element("summary", "gallery-summary");
    const media = element("figure", "gallery-media");
    const image = createSafeImage(
      {
        src: item.src,
        alt: item.alt || item.title,
        width: item.imageWidth,
        height: item.imageHeight,
        fit: item.fit || "cover",
        className: "gallery-image"
      },
      () => {
        card.remove();
        hideIfEmpty();
      }
    );

    if (!image) return;
    media.append(image);

    const summaryMeta = element("div", "gallery-summary-meta");
    summaryMeta.append(
      element("span", "gallery-type", item.type || "proof"),
      element("span", "gallery-action", "View proof")
    );
    summary.append(media, summaryMeta);

    const content = element("div", "gallery-content");
    content.append(
      element("h3", "", item.title),
      element("p", "", item.caption)
    );
    card.append(summary, content);
    mount.append(card);
  });

  hideIfEmpty();
}

function renderContact() {
  const mount = byId("contact-card");
  const copy = element("div", "contact-copy");
  copy.append(
    element("p", "eyebrow", "recruiter.route"),
    element("p", "contact-status", "Status: available for internship conversations")
  );

  const title = element("h2");
  appendText(title, `${data.contact.titleBefore} `);
  title.append(element("span", "", data.contact.titleEmphasis));
  copy.append(title, element("p", "", data.contact.description));

  const actions = element("div", "contact-actions");
  data.contact.actions
    .filter((action) => action.visible !== false && resolveLink(action))
    .forEach((action) => {
      const href = resolveLink(action);
      const link = configureLink(
        element(
          "a",
          `contact-link${action.primary ? " contact-link-primary" : ""}`
        ),
        href,
        {
          download: action.download,
          ariaLabel: `${action.label} for ${data.profile.name}`
        }
      );
      link.append(
        element("span", "", action.label),
        element("strong", "", action.value)
      );
      actions.append(link);
    });

  mount.append(copy, actions);
}

function renderFooter() {
  byId("footer-content").append(
    element("p", "", data.footer.copyright),
    element("p", "", data.footer.note)
  );
}

function renderSectionHeadings() {
  Object.entries(data.sectionHeadings).forEach(([section, config]) => {
    const mount = byId(`${section}-heading`);
    if (mount) mount.append(createSectionHeading(config));
  });
}

function renderPortfolio() {
  if (!data) {
    document.body.classList.add("data-error");
    return;
  }

  renderSiteMetadata();
  renderNavigation();
  renderHero();
  renderProfile();
  renderProofStrip();
  renderSectionHeadings();
  renderCurrentlyBuilding();
  renderQuote();
  renderProjects();
  renderSkills();
  renderCodingProfiles();
  renderEducation();
  renderAchievements();
  renderCertifications();
  renderGallery();
  renderContact();
  renderFooter();
}

function initializeNavigation() {
  const hamburger = byId("hamburger");
  const navLinks = byId("nav-links");
  const navItems = document.querySelectorAll(".nav-links a[href^='#']");
  const allNavLinks = document.querySelectorAll(".nav-links a");
  const desktopBreakpoint = window.matchMedia("(min-width: 901px)");

  function setMenuState(isOpen) {
    navLinks.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    hamburger.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );
  }

  hamburger.addEventListener("click", () => {
    setMenuState(!navLinks.classList.contains("open"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinks.classList.contains("open")) {
      setMenuState(false);
      hamburger.focus();
    }
  });

  desktopBreakpoint.addEventListener("change", (event) => {
    if (event.matches) setMenuState(false);
  });

  allNavLinks.forEach((item) => {
    item.addEventListener("click", () => setMenuState(false));
  });

  if ("IntersectionObserver" in window) {
    const sections = document.querySelectorAll("main section[id]:not([hidden])");
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navItems.forEach((link) => {
            const isCurrent =
              link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("active", isCurrent);
            if (isCurrent) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-28% 0px -62% 0px", threshold: 0 }
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }
}

function initializeAdminAccess() {
  const adminItem = byId("nav-admin-item");
  if (!adminItem) return;

  let accessCheck = 0;
  let authSubscription = null;

  function setAdminVisible(visible) {
    adminItem.hidden = !visible;
    document.documentElement.dataset.adminAccess = visible ? "verified" : "hidden";
  }

  async function checkAdminAccess() {
    const currentCheck = ++accessCheck;
    setAdminVisible(false);

    try {
      const allowed =
        await window.PortfolioSupabase?.getAdminAccess?.();
      if (currentCheck !== accessCheck) return;
      setAdminVisible(allowed === true);
    } catch {
      setAdminVisible(false);
    }
  }

  document.addEventListener("keydown", (event) => {
    const isShortcut =
      event.ctrlKey &&
      event.shiftKey &&
      !event.altKey &&
      !event.metaKey &&
      event.key.toLowerCase() === "a";

    if (!isShortcut) return;
    event.preventDefault();
    window.location.assign("admin.html");
  });

  window.addEventListener("focus", checkAdminAccess);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") checkAdminAccess();
  });

  window.PortfolioSupabase?.ready
    ?.then((client) => {
      if (!client) return;
      const listener = client.auth.onAuthStateChange(() => {
        window.setTimeout(checkAdminAccess, 0);
      });
      authSubscription = listener.data.subscription;
    })
    .catch(() => setAdminVisible(false));

  window.addEventListener(
    "pagehide",
    () => authSubscription?.unsubscribe(),
    { once: true }
  );

  checkAdminAccess();
}

function initializeRevealAnimations() {
  const revealElements = document.querySelectorAll(".reveal, .reveal-stagger");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    revealElements.forEach((node) => node.classList.add("visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealElements.forEach((node) => revealObserver.observe(node));
}

function restoreHashPosition() {
  if (!window.location.hash) return;
  const target = document.querySelector(window.location.hash);
  if (!target) return;

  window.setTimeout(() => target.scrollIntoView({ block: "start" }), 50);
}

async function hideMissingLocalResume() {
  const resume = data.links?.resume;
  if (!resume || /^[a-z][a-z\d+.-]*:/i.test(resume) || resume.startsWith("//")) {
    return;
  }

  try {
    const response = await fetch(resume, { method: "HEAD", cache: "no-store" });
    if (!response.ok) data.links.resume = "";
  } catch {
    data.links.resume = "";
  }
}

async function bootstrapPortfolio() {
  data = window.PortfolioService
    ? await window.PortfolioService.loadPortfolio(window.PORTFOLIO_DATA)
    : window.PORTFOLIO_DATA;

  await hideMissingLocalResume();
  renderPortfolio();
  initializeNavigation();
  initializeAdminAccess();
  initializeRevealAnimations();
  restoreHashPosition();
  document.documentElement.dataset.portfolioReady = "true";
  document.dispatchEvent(new CustomEvent("portfolio:ready"));
}

bootstrapPortfolio();
