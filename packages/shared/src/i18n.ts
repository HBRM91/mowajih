export const i18nKeys = {
  app: {
    name: "app.name",
    tagline: "app.tagline",
  },
  nav: {
    home: "nav.home",
    orientation: "nav.orientation",
    privacy: "nav.privacy",
  },
  step: {
    track: "step.track",
    grades: "step.grades",
    profile: "step.profile",
    consent: "step.consent",
  },
  track: {
    SM: "track.SM",
    PC: "track.PC",
    SVT: "track.SVT",
    SE: "track.SE",
    SH: "track.SH",
    STI: "track.STI",
    L: "track.L",
  },
  grade: {
    general: "grade.general",
    math: "grade.math",
    physics: "grade.physics",
  },
  mention: {
    predicted: "mention.predicted",
  },
  city: {
    label: "city.label",
  },
  financial: {
    label: "financial.label",
    low: "financial.<<3000",
    midLow: "financial.3000-8000",
    midHigh: "financial.8000-15000",
    high: "financial.>15000",
  },
  consent: {
    title: "consent.title",
    text: "consent.text",
    checkbox: "consent.checkbox",
  },
  submit: {
    evaluate: "submit.evaluate",
  },
  results: {
    title: "results.title",
    noMatches: "results.noMatches",
  },
  match: {
    probability: "match.probability",
    rationale: "match.rationale",
    cost: "match.cost",
  },
  cta: {
    optin: "cta.optin",
  },
  footer: {
    cndp: "footer.cndp",
    contact: "footer.contact",
  },
} as const;

export type I18nKeys = typeof i18nKeys;
