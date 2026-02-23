export const REGION_OPTIONS = [
  "Pakistan",
  "Global",
  "United States",
  "United Kingdom",
  "India",
  "Middle East",
  "Other",
] as const;

export type RegionOption = (typeof REGION_OPTIONS)[number];
