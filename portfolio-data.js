/*
 * Edit this file to update portfolio content.
 * See CONTENT_GUIDE.md for simple examples and image recommendations.
 */
window.PORTFOLIO_DATA = {
  site: {
    title: "Trupti Patil | Software Engineering Portfolio",
    description:
      "Trupti Patil is a Computer Engineering student building backend, full-stack, cybersecurity, and AI products with Java, Spring Boot, React, Python, and FastAPI."
  },

  profile: {
    name: "Trupti Patil",
    photo: "",
    fallbackInitials: "TP",
    alt: "Trupti Patil profile photo",
    role: "Computer Engineering",
    location: "Pune, India",
    details: [
      { label: "Currently building", value: "Secure backend & full-stack systems" },
      { label: "Core stack", value: "Java · Spring Boot · React · Python" },
      { label: "Internship target", value: "SWE · Backend · Full Stack · AI/ML" }
    ]
  },

  links: {
    resume: "resume.pdf",
    email: "mailto:truptipatil9506@gmail.com",
    github: "https://github.com/Trupti-14",
    linkedin: "https://www.linkedin.com/in/trupti-patil-09ba2332b/",
    leetcode: ""
  },

  hero: {
    eyebrow: "Open to software engineering internships",
    headlineBefore: "Backend-first engineer building",
    headlineEmphasis: "secure, full-stack",
    headlineAfter: "and AI-powered systems.",
    intro:
      "I’m Trupti Patil, a B.Tech Computer Engineering student at Cummins College, Pune, focused on Java, Spring Boot, React, Python, REST APIs, DSA, graph algorithms, and applied AI.",
    roleLine:
      "Targeting Software Engineering, Backend, Full Stack, and AI/ML Intern roles.",
    actions: [
      { label: "View Projects", href: "#projects", style: "primary", visible: true },
      {
        label: "Resume",
        linkKey: "resume",
        style: "resume",
        download: true,
        visible: true
      },
      { label: "GitHub", linkKey: "github", style: "ghost", visible: true },
      { label: "LinkedIn", linkKey: "linkedin", style: "ghost", visible: true },
      { label: "LeetCode", linkKey: "leetcode", style: "ghost", visible: true }
    ]
  },

  proofStrip: [
    { id: "cgpa", value: "8.8/10", label: "CGPA", visible: true, order: 1 },
    {
      id: "suraksha",
      value: "Top 134",
      label: "of 1,000+ teams",
      visible: true,
      order: 2
    },
    {
      id: "buffer",
      value: "1st Prize",
      label: "FinTech Hackathon",
      visible: true,
      order: 3
    },
    {
      id: "engineering",
      value: "Java + DSA",
      label: "Core engineering",
      visible: true,
      order: 4
    },
    { id: "location", value: "Pune", label: "India", visible: true, order: 5 }
  ],

  currentlyBuilding: [
    {
      id: "et-ai-hackathon",
      title: "ET AI Hackathon 2.0",
      status: "Qualified Round 1",
      description:
        "Working on the selected problem statement and solution approach for the next round.",
      tags: ["AI", "Hackathon", "Problem Solving"],
      visible: true,
      order: 1
    },
    {
      id: "vanguard-prototype",
      title: "Vanguard Prototype",
      status: "In Progress",
      description:
        "Improving the banking cybersecurity and compliance automation prototype to make it more feasible, practical, and demo-ready.",
      tags: ["Cybersecurity", "Compliance", "Prototype"],
      visible: true,
      order: 2
    },
    {
      id: "dsa-preparation",
      title: "DSA Preparation",
      status: "Daily Practice",
      description:
        "Preparing Data Structures and Algorithms in Java for software engineering internship interviews.",
      tags: ["Java", "DSA", "Interviews"],
      visible: true,
      order: 3
    }
  ],

  quote: {
    visible: true,
    text: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    context: "A reminder to keep building real systems, not just ideas."
  },

  codingProfiles: [
    {
      id: "leetcode",
      platform: "LeetCode",
      username: "",
      url: "",
      visible: true,
      order: 1
    },
    {
      id: "codeforces",
      platform: "Codeforces",
      username: "",
      url: "",
      visible: true,
      order: 2
    },
    {
      id: "codechef",
      platform: "CodeChef",
      username: "",
      url: "",
      visible: true,
      order: 3
    },
    {
      id: "hackerrank",
      platform: "HackerRank",
      username: "",
      url: "",
      visible: true,
      order: 4
    }
  ],

  sectionHeadings: {
    "currently-building": {
      eyebrow: "Active queue",
      titleBefore: "Currently",
      titleEmphasis: "building",
      description:
        "A compact view of the systems, competitions, and interview preparation in progress right now."
    },
    projects: {
      eyebrow: "Selected work",
      titleBefore: "Projects with",
      titleEmphasis: "engineering depth",
      description:
        "Cybersecurity, backend, full-stack, and AI systems built through hands-on development and competitive hackathons."
    },
    skills: {
      eyebrow: "Technical toolkit",
      titleBefore: "Skills aligned with",
      titleEmphasis: "SDE roles",
      description:
        "A focused stack for backend systems, full-stack products, applied AI, and core computer science problem-solving."
    },
    achievements: {
      eyebrow: "Recognition",
      titleBefore: "Achievements that show",
      titleEmphasis: "execution",
      description:
        "Competitive programming, national hackathons, technical events, teamwork, and leadership experience."
    },
    certifications: {
      eyebrow: "Programs & credentials",
      titleBefore: "Continuous",
      titleEmphasis: "learning",
      description:
        "Selected programs and certifications that strengthened my foundations in Java, DSA, AI, problem-solving, and leadership."
    },
    gallery: {
      eyebrow: "Proof archive",
      titleBefore: "Selected",
      titleEmphasis: "evidence",
      description:
        "A small, curated set of achievement, certificate, and event proof—not a photo album."
    }
  },

  projects: [
    {
      id: "shadowtrace",
      title: "ShadowTrace",
      featured: true,
      visible: true,
      order: 1,
      label: "Featured · Cybersecurity",
      description:
        "Built a full-stack cybersecurity threat-monitoring platform with a Spring Boot REST backend and React interface. Modeled threat relationships as graphs and applied BFS, Dijkstra, DSU, Tarjan SCC, and topological sorting for attack path analysis, connectivity checks, component detection, and mitigation planning.",
      contribution:
        "Full-stack architecture, REST workflows, and graph-based threat analysis.",
      tags: ["Java", "Spring Boot", "React", "REST APIs", "Graph Algorithms"],
      github: "",
      live: "",
      image: "",
      imageAlt: "ShadowTrace cybersecurity threat monitoring platform",
      imageWidth: 1600,
      imageHeight: 900
    },
    {
      id: "vanguard",
      title: "Vanguard",
      featured: true,
      visible: true,
      order: 2,
      label: "Featured · National Hackathon",
      description:
        "Built a banking cybersecurity and compliance automation solution for Canara Bank Suraksha Hackathon 2.0. The project analyzes RBI-style circulars, detects policy gaps, assigns priority scores, and supports evidence-based compliance tracking. Shortlisted among Top 134 teams from 1,000+ teams across India.",
      contribution:
        "Compliance-analysis workflow, policy-gap detection, scoring, and evidence tracking.",
      tags: ["Python", "FastAPI", "React", "Cybersecurity", "Compliance Automation"],
      github: "",
      live: "",
      image: "",
      imageAlt: "Vanguard banking cybersecurity and compliance platform",
      imageWidth: 1600,
      imageHeight: 900
    },
    {
      id: "ayucare",
      title: "AyuCare",
      featured: false,
      visible: true,
      order: 3,
      label: "AI/ML",
      description:
        "Built an AI-assisted disease screening platform for heart, kidney, diabetes, and skin conditions using scikit-learn and Keras models exposed through FastAPI. Added symptom-based and image-based screening features for early health risk prediction.",
      contribution:
        "ML screening workflows, FastAPI integration, and health-risk prediction features.",
      tags: ["Python", "FastAPI", "scikit-learn", "Keras", "Machine Learning"],
      github: "https://github.com/SrushTae2430/BuildBots",
      live: "",
      image: "",
      imageAlt: "AyuCare AI-assisted disease screening platform",
      imageWidth: 1600,
      imageHeight: 900
    },
    {
      id: "swiftshare",
      title: "SwiftShare",
      featured: false,
      visible: true,
      order: 4,
      label: "Hackathon Winner",
      description:
        "Built a Java expense-settlement system supporting group payments, equal and unequal bill splits, transaction history, and optimized settlements using OOP and Java Collections. Won 1st Prize at Buffer 6.0 FinTech Hackathon.",
      contribution:
        "Settlement logic, transaction tracking, object-oriented design, and data modeling.",
      tags: ["Java", "OOP", "Collections", "Data Structures"],
      github: "https://github.com/Trupti-14/Swift-Share-Finance-management-",
      live: "",
      image: "",
      imageAlt: "SwiftShare Java expense settlement system",
      imageWidth: 1600,
      imageHeight: 900
    }
  ],

  skills: [
    {
      id: "languages",
      title: "Languages",
      items: ["Java", "Python", "JavaScript", "SQL"],
      visible: true,
      order: 1,
      wide: false
    },
    {
      id: "backend",
      title: "Backend",
      items: ["Spring Boot", "FastAPI", "REST APIs"],
      visible: true,
      order: 2,
      wide: false
    },
    {
      id: "frontend",
      title: "Frontend",
      items: ["React", "Tailwind CSS", "HTML", "CSS"],
      visible: true,
      order: 3,
      wide: false
    },
    {
      id: "databases",
      title: "Databases",
      items: ["MySQL", "MongoDB"],
      visible: true,
      order: 4,
      wide: false
    },
    {
      id: "ai-ml",
      title: "AI / ML",
      items: ["scikit-learn", "Keras"],
      visible: true,
      order: 5,
      wide: false
    },
    {
      id: "core-cs",
      title: "Core Computer Science",
      items: [
        "DSA",
        "OOP",
        "DBMS",
        "Operating Systems",
        "Computer Networks",
        "Graph Algorithms"
      ],
      visible: true,
      order: 6,
      wide: true
    },
    {
      id: "tools",
      title: "Tools",
      items: ["Git", "GitHub", "Docker", "VS Code", "Postman"],
      visible: true,
      order: 7,
      wide: true
    }
  ],

  education: {
    visible: true,
    eyebrow: "Education & direction",
    titleBefore: "Strong foundations,",
    titleEmphasis: "practical execution",
    paragraphs: [
      "I enjoy turning algorithmic ideas into working software systems. My strongest work combines Java backend development, graph algorithms, cybersecurity, full-stack development, and applied AI.",
      "Through national-level hackathons, competitive programming, and the Amazon Future Engineer Bootcamp, I have strengthened my Java, DSA, collaboration, and rapid-prototyping skills."
    ],
    period: "Expected graduation · 2028",
    degree: "B.Tech in Computer Engineering",
    institution: "MKSSS’s Cummins College of Engineering for Women, Pune",
    facts: [
      { label: "CGPA", value: "8.8/10" },
      { label: "Location", value: "Pune, India" }
    ]
  },

  achievementGroups: [
    {
      id: "technical",
      title: "Technical Achievements",
      marker: "A",
      visible: true,
      order: 1
    },
    {
      id: "leadership",
      title: "Leadership & Activities",
      marker: "B",
      visible: true,
      order: 2
    }
  ],

  achievements: [
    {
      id: "canara-suraksha",
      group: "technical",
      rank: "Top 134 / 1,000+",
      title: "Canara Bank Suraksha Hackathon 2.0",
      description:
        "Vanguard was shortlisted among the Top 134 teams from more than 1,000 teams across India.",
      primary: true,
      image: "",
      imageAlt: "Canara Bank Suraksha Hackathon achievement",
      imageFit: "cover",
      proofImages: [],
      visible: true,
      order: 1
    },
    {
      id: "buffer-6-fintech",
      group: "technical",
      rank: "1st Prize",
      title: "Buffer 6.0 · FinTech Domain",
      description:
        "Won first prize for SwiftShare, a Java-based group expense settlement system.",
      primary: true,
      image: "",
      imageAlt: "Buffer 6.0 FinTech Hackathon achievement",
      imageFit: "cover",
      proofImages: [],
      visible: true,
      order: 2
    },
    {
      id: "cipher-8-1",
      group: "technical",
      rank: "1st Rank",
      title: "Cipher 8.1 · HackerRank Coding Contest",
      description:
        "Secured first position in the competitive programming contest organized by Loop Club.",
      primary: true,
      image: "",
      imageAlt: "Cipher 8.1 coding contest achievement",
      imageFit: "cover",
      proofImages: [
        {
          src: "images/cipher.png",
          alt: "Cipher 8.1 first-rank certificate",
          fit: "contain",
          width: 1060,
          height: 749
        }
      ],
      visible: true,
      order: 3
    },
    {
      id: "pict-techfiesta",
      group: "technical",
      rank: "Round 1 Qualifier",
      title: "PICT TechFiesta Hackathon",
      description:
        "Qualified in Round 1 of the international hackathon among 700+ participating teams.",
      primary: false,
      image: "",
      imageAlt: "PICT TechFiesta Hackathon achievement",
      imageFit: "cover",
      proofImages: [],
      visible: true,
      order: 4
    },
    {
      id: "adcet-hackathon",
      group: "technical",
      rank: "Round 1 Qualifier",
      title: "ADCET Software Hackathon",
      description:
        "Advanced through Round 1 in the software domain while competing among 564+ teams.",
      primary: false,
      image: "",
      imageAlt: "ADCET Software Hackathon achievement",
      imageFit: "cover",
      proofImages: [],
      visible: true,
      order: 5
    },
    {
      id: "cricket",
      group: "leadership",
      rank: "2nd Prize",
      title: "Intra-College Cricket Tournament",
      description:
        "Earned second place as part of the class team, demonstrating coordination, teamwork, and competitive spirit.",
      primary: false,
      image: "",
      imageAlt: "Intra-college cricket tournament team",
      imageFit: "cover",
      proofImages: [],
      visible: true,
      order: 1
    },
    {
      id: "innovation-2025",
      group: "leadership",
      rank: "Event Manager",
      title: "Innovation 2025",
      description:
        "Coordinated technical event execution, logistics, and participant engagement.",
      primary: false,
      image: "",
      imageAlt: "Innovation 2025 event management activity",
      imageFit: "cover",
      proofImages: [],
      visible: true,
      order: 2
    }
  ],

  certifications: [
    {
      id: "afe-bootcamp",
      type: "10-month program",
      title: "Amazon Future Engineer Bootcamp",
      description:
        "Built strong foundations in Java, data structures, algorithms, problem-solving, and application development.",
      tags: ["Java", "DSA", "Problem Solving"],
      image: "images/afe.png",
      imageAlt: "Amazon Future Engineer Bootcamp completion certificate",
      imageWidth: 1000,
      imageHeight: 706,
      visible: true,
      order: 1
    },
    {
      id: "cipher-certificate",
      type: "Competitive programming",
      title: "Cipher 8.1 · 1st Rank",
      description:
        "Recognition for securing first place in a HackerRank coding contest organized by Loop Club.",
      tags: ["Algorithms", "HackerRank", "Problem Solving"],
      image: "images/cipher.png",
      imageAlt: "Cipher 8.1 competitive programming first-rank certificate",
      imageWidth: 1060,
      imageHeight: 749,
      visible: true,
      order: 2
    },
    {
      id: "aws-genai",
      type: "AI fundamentals",
      title: "Introducing Generative AI with AWS",
      description:
        "Studied generative AI foundations, cloud-based AI services, and practical applications through Udacity.",
      tags: ["Generative AI", "AWS", "Cloud"],
      image: "images/aws-genai.png",
      imageAlt: "Introducing Generative AI with AWS certificate from Udacity",
      imageWidth: 1079,
      imageHeight: 741,
      visible: true,
      order: 3
    },
    {
      id: "fly-scholar",
      type: "Leadership program",
      title: "FLY Scholar Program",
      description:
        "Developed problem-solving, innovation, perseverance, initiative, and leadership through the Competitiveness Mindset Institute.",
      tags: ["Leadership", "Innovation", "Mindset"],
      image: "images/fly.png",
      imageAlt: "FLY Scholar program completion certificate",
      imageWidth: 542,
      imageHeight: 767,
      visible: true,
      order: 4
    }
  ],

  gallery: [
    {
      id: "cipher-8-1-proof",
      title: "Cipher 8.1 Coding Contest",
      caption: "1st Rank in the HackerRank coding contest organized by Loop Club.",
      src: "images/cipher.png",
      alt: "Cipher 8.1 competitive programming first-rank certificate",
      type: "certificate",
      fit: "contain",
      imageWidth: 1060,
      imageHeight: 749,
      visible: true,
      order: 1
    }
  ],

  contact: {
    eyebrow: "Let’s connect",
    titleBefore: "Looking for an intern who likes",
    titleEmphasis: "hard problems?",
    description:
      "I’m currently seeking Software Engineering, Backend, Full Stack, and AI/ML internship opportunities. If you’re building meaningful products or engineering systems, I’d be glad to connect.",
    actions: [
      {
        label: "Email",
        value: "truptipatil9506@gmail.com",
        linkKey: "email",
        primary: true,
        visible: true
      },
      {
        label: "Resume",
        value: "Download PDF",
        linkKey: "resume",
        download: true,
        visible: true
      },
      {
        label: "GitHub",
        value: "Trupti-14 ↗",
        linkKey: "github",
        visible: true
      },
      {
        label: "LinkedIn",
        value: "Trupti Patil ↗",
        linkKey: "linkedin",
        visible: true
      },
      {
        label: "LeetCode",
        value: "View profile ↗",
        linkKey: "leetcode",
        visible: true
      }
    ]
  },

  footer: {
    copyright: "© 2026 Trupti Patil",
    note: "Designed and built for meaningful engineering opportunities."
  }
};
