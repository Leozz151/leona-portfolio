import seedData from "@/data/data.json";

export type TimelineItem = {
  date: string;
  title: string;
  badge: string;
  text: string;
};

export type TextItem = {
  title: string;
  text: string;
};

export type ProjectItem = {
  metaLeft: string;
  metaRight: string;
  title: string;
  text: string;
  bullets: string[];
  imageUrl: string;
  featured: boolean;
};

export type PortfolioContent = {
  siteTitle: string;
  metaDescription: string;
  nav: {
    projects: string;
    strengths: string;
    journey: string;
    skills: string;
    contact: string;
    admin: string;
  };
  sectionOrder: string[];
  hero: {
    eyebrow: string;
    englishName: string;
    title: string;
    intro: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    portraitUrl: string;
    portraitAlt: string;
    quickFacts: string[];
  };
  about: {
    title: string;
    intro: string;
    items: TextItem[];
  };
  journey: {
    title: string;
    intro: string;
    items: TimelineItem[];
  };
  projects: {
    title: string;
    intro: string;
    items: ProjectItem[];
  };
  skills: {
    title: string;
    hardTitle: string;
    softTitle: string;
    hardItems: string[];
    softItems: string[];
  };
  beyond: {
    title: string;
    text: string;
    highlight: string;
  };
  contact: {
    title: string;
    email: string;
    linkedin: string;
    linkedinLabel: string;
    resume: string;
    resumeLabel: string;
  };
};

export const defaultContent: PortfolioContent = seedData as PortfolioContent;

export const sectionLabels: Record<string, string> = {
  about: "專業特質",
  journey: "成長曲線",
  projects: "深度專案",
  skills: "技能與生活",
  beyond: "生活側寫",
};

export function mergeContent(base: PortfolioContent, override?: Partial<PortfolioContent>): PortfolioContent {
  if (!override) {
    return structuredClone(base);
  }

  const mergeValue = (baseValue: unknown, overrideValue: unknown): unknown => {
    if (Array.isArray(baseValue)) {
      return Array.isArray(overrideValue) ? overrideValue : structuredClone(baseValue);
    }

    if (typeof baseValue !== "object" || baseValue === null) {
      return overrideValue === undefined ? baseValue : overrideValue;
    }

    const result: Record<string, unknown> = {};
    Object.entries(baseValue).forEach(([key, value]) => {
      result[key] = mergeValue(value, (overrideValue as Record<string, unknown> | undefined)?.[key]);
    });

    if (overrideValue && typeof overrideValue === "object") {
      Object.entries(overrideValue).forEach(([key, value]) => {
        if (!(key in result)) {
          result[key] = value;
        }
      });
    }

    return result;
  };

  return mergeValue(base, override) as PortfolioContent;
}
