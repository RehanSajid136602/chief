export type ChefRegion = "Pakistan" | "Worldwide";

export interface ChefImageSource {
  src: string;
  alt: string;
  sourcePage: string;
  sourceLabel: string;
  verified: true;
}

export interface ChefProfile {
  id: string;
  slug: string;
  name: string;
  region: ChefRegion;
  country: string;
  specialty: string;
  shortBio: string;
  notableFor: string;
  image: ChefImageSource;
  links: {
    official?: string;
    wikipedia?: string;
    instagram?: string;
  };
}
