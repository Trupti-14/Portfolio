/*
 * Built-in quote bank used for offline daily rotation and optional Supabase seeding.
 * Stable IDs prevent duplicates when "Seed default quotes" is used more than once.
 */
window.DEFAULT_QUOTES = [
  {
    id: "legacy-build-principle",
    quote_text: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds",
    context: "Building and execution",
    visible: true,
    display_order: 10
  },
  {
    id: "dijkstra-testing",
    quote_text: "Testing shows the presence, not the absence of bugs.",
    author: "Edsger W. Dijkstra",
    context: "Software correctness",
    visible: true,
    display_order: 20
  },
  {
    id: "dijkstra-simplicity",
    quote_text: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
    context: "Reliable systems",
    visible: true,
    display_order: 30
  },
  {
    id: "dijkstra-abstraction",
    quote_text: "The purpose of abstracting is not to be vague, but to create a new semantic level in which one can be absolutely precise.",
    author: "Edsger W. Dijkstra",
    context: "Abstraction and precision",
    visible: true,
    display_order: 40
  },
  {
    id: "hamilton-pioneers",
    quote_text: "There was no choice but to be pioneers.",
    author: "Margaret Hamilton",
    context: "Software engineering",
    visible: true,
    display_order: 50
  },
  {
    id: "knuth-optimization",
    quote_text: "Premature optimization is the root of all evil.",
    author: "Donald Knuth",
    context: "Performance engineering",
    visible: true,
    display_order: 60
  },
  {
    id: "kay-invent-future",
    quote_text: "The best way to predict the future is to invent it.",
    author: "Alan Kay",
    context: "Innovation",
    visible: true,
    display_order: 70
  },
  {
    id: "sicp-programs-for-people",
    quote_text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Harold Abelson and Gerald Jay Sussman",
    context: "Readable software",
    visible: true,
    display_order: 80
  },
  {
    id: "kernighan-complexity",
    quote_text: "Controlling complexity is the essence of computer programming.",
    author: "Brian Kernighan",
    context: "Software design",
    visible: true,
    display_order: 90
  },
  {
    id: "fowler-human-code",
    quote_text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
    context: "Maintainable code",
    visible: true,
    display_order: 100
  },
  {
    id: "beck-make-it",
    quote_text: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
    context: "Iterative engineering",
    visible: true,
    display_order: 110
  },
  {
    id: "brooks-conceptual-integrity",
    quote_text: "Conceptual integrity is the most important consideration in system design.",
    author: "Fred Brooks",
    context: "System architecture",
    visible: true,
    display_order: 120
  },
  {
    id: "hoare-simplicity",
    quote_text: "The price of reliability is the pursuit of the utmost simplicity.",
    author: "C. A. R. Hoare",
    context: "Reliable software",
    visible: true,
    display_order: 130
  },
  {
    id: "ritchie-c-success",
    quote_text: "C is quirky, flawed, and an enormous success.",
    author: "Dennis Ritchie",
    context: "Programming languages",
    visible: true,
    display_order: 140
  },
  {
    id: "stroustrup-two-languages",
    quote_text: "There are only two kinds of languages: the ones people complain about and the ones nobody uses.",
    author: "Bjarne Stroustrup",
    context: "Engineering trade-offs",
    visible: true,
    display_order: 150
  },
  {
    id: "feynman-create-understand",
    quote_text: "What I cannot create, I do not understand.",
    author: "Richard Feynman",
    context: "Learning by building",
    visible: true,
    display_order: 160
  },
  {
    id: "box-models",
    quote_text: "All models are wrong, but some are useful.",
    author: "George E. P. Box",
    context: "Applied modeling",
    visible: true,
    display_order: 170
  },
  {
    id: "tukey-right-problem",
    quote_text: "An approximate answer to the right problem is worth a good deal more than an exact answer to an approximate problem.",
    author: "John Tukey",
    context: "Problem formulation",
    visible: true,
    display_order: 180
  },
  {
    id: "curie-understand",
    quote_text: "Nothing in life is to be feared; it is only to be understood.",
    author: "Marie Curie",
    context: "Scientific curiosity",
    visible: true,
    display_order: 190
  },
  {
    id: "lovelace-analytical-engine",
    quote_text: "The Analytical Engine weaves algebraic patterns, just as the Jacquard loom weaves flowers and leaves.",
    author: "Ada Lovelace",
    context: "Computing and imagination",
    visible: true,
    display_order: 200
  }
];
