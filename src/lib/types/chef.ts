export type ChefRegion = "Pakistan" | "Worldwide";

export interface ChefProfile {
  id: string;
  slug: string;
  name: string;
  region: ChefRegion;
  country: string;
  specialty: string;
  shortBio: string;
  notableFor: string;
  links: {
    official?: string;
    wikipedia?: string;
    instagram?: string;
  };
}
