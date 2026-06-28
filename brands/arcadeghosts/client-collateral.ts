export const arcadeghostsClientCollateral = {
  positioning: {
    primaryRole: "Software consultant for internal tools and workflow automation",
    oneLiner:
      "I help small and mid-sized businesses replace repetitive spreadsheet, email, and manual processes with simple internal tools.",
    shortPromise: "Small projects. Clear problems. Personal attention.",
    tagline:
      "Internal tools, workflow automation, AI workflows, and technical cleanup.",
    problemSummary:
      "Need help with intake, approvals, reporting, workflow cleanup, or a small internal tool?",
    audience: [
      "Small and mid-sized businesses that run on spreadsheets, email, PDFs, and manual coordination.",
      "Operations-heavy teams that need clearer status, smoother intake, or less repetitive admin work.",
      "Owners and operators who want practical software help without a big-agency process.",
    ],
  },
  ctas: {
    primaryCTA: {
      label: "Work With Me",
      description:
        "Start with a short conversation about the problem and the smallest useful next step.",
      linkKey: "workWithMe",
    },
    secondaryCTA: {
      label: "Project Inquiry",
      description:
        "Use this for interested or qualified prospects who want a clearer next step.",
      linkKey: "projectInquiry",
    },
    contactCTA: {
      label: "Email Jason",
      description:
        "Use this when a direct conversation path is more appropriate than a formal intake step.",
      linkKey: "contactEmail",
    },
    proposalCTA: {
      label: "Request Proposal",
      description:
        "Use this after the problem and likely scope are clear enough for a written recommendation.",
      linkKey: "projectInquiry",
    },
    discoveryCTA: {
      label: "Discovery Session",
      description:
        "Use this only after conversation, qualification, and agreement on the next step.",
      linkKey: "discoverySession",
    },
  },
  services: [
    {
      name: "Internal tools",
      summary:
        "Small web apps for intake, request tracking, approvals, dashboards, and shared team visibility.",
    },
    {
      name: "Workflow automation",
      summary:
        "Replace repeated copy-paste, manual handoffs, and fragile admin routines with calmer systems.",
    },
    {
      name: "AI workflows",
      summary:
        "Practical AI-assisted processes for summaries, structured data handling, drafting, and internal knowledge work.",
    },
    {
      name: "Technical cleanup",
      summary:
        "Fix awkward websites, unreliable forms, reporting friction, and rough edges that slow a team down.",
    },
  ],
  proofSignals: [
    "Start small with a clear problem instead of forcing a giant software project.",
    "Work with the tools a team already has where possible, including spreadsheets, forms, and email.",
    "Keep communication direct, practical, and understandable for non-technical clients.",
  ],
  proposal: {
    eyebrow: "Proposal Cover",
    title: "Practical software help for teams that have outgrown manual processes.",
    subtitle:
      "Internal tools, workflow automation, AI-assisted operations, and technical cleanup for small and mid-sized businesses.",
    footerNote:
      "Prepared as a clear first step toward a scoped project, not a giant transformation deck.",
  },
  capability: {
    eyebrow: "Capability Sheet",
    title: "How Jason can help",
    intro:
      "A one-page overview for warm leads, referrals, and operators who need practical help with messy internal workflows.",
    outcomes: [
      "Clearer visibility into requests, approvals, and status.",
      "Less repeated data entry and fewer copy-paste tasks.",
      "Faster intake, reporting, and internal coordination.",
    ],
    problemPatterns: [
      "Spreadsheet request tracking that keeps losing status visibility.",
      "Approvals buried in long email threads or manual follow-up.",
      "Repetitive reports assembled by hand every week or month.",
      "Forms, PDFs, or intake details that are hard to search and coordinate.",
    ],
    engagementModes: [
      "Small scoped projects",
      "Workflow audits and cleanup passes",
      "Automation and AI implementation support",
    ],
    howToStart: [
      "Share the current workflow and where it gets messy.",
      "Identify the smallest problem worth fixing first.",
      "Decide whether a short recommendation, discovery call, or scoped proposal makes sense.",
    ],
  },
  discovery: {
    eyebrow: "Discovery Call Guide",
    title: "What a first conversation looks like",
    subtitle:
      "A calm, low-pressure working session to understand the problem, the current workflow, and whether a small project would help.",
    agenda: [
      "Understand the current process and where it gets messy.",
      "Identify the highest-friction manual steps, delays, or repeated questions.",
      "Discuss a smallest-useful next step, including whether the problem is worth solving right now.",
    ],
    prepQuestions: [
      "What work is currently tracked in spreadsheets, inboxes, PDFs, or shared docs?",
      "Where do requests, approvals, or updates tend to get stuck?",
      "What reporting or status questions come up repeatedly?",
      "If one process felt dramatically easier next month, which one would matter most?",
    ],
    nextStep:
      "If the fit seems good, the follow-up is a simple recommendation or proposal rather than a vague promise.",
  },
  caseStudy: {
    eyebrow: "Case Study Template",
    title: "Reusable format for future client proof",
    intro:
      "Use this after real client work exists. Keep it specific, concrete, and practical rather than turning it into generic marketing language.",
    sections: [
      {
        label: "Problem",
        prompt:
          "What was slowing the team down before the work began? Focus on the real manual pain.",
      },
      {
        label: "Approach",
        prompt:
          "What did Jason build, automate, clean up, or clarify to make the process easier?",
      },
      {
        label: "Outcome",
        prompt:
          "What changed in practice: speed, visibility, fewer emails, fewer errors, calmer handoffs, or clearer reporting?",
      },
      {
        label: "Why it mattered",
        prompt:
          "Why was the improvement useful to the team, not just technically interesting?",
      },
    ],
    metricPrompts: [
      "hours saved",
      "fewer manual steps",
      "faster turnaround",
      "better status visibility",
    ],
    quotePrompt:
      "Add a short client quote later if there is real language worth using.",
  },
} as const;
