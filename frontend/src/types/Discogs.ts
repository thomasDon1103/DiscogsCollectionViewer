export interface DiscogsFormat {
  name: string;
  qty: string;
  text?: string;
  descriptions?: string[];
}

export interface DiscogsLabel {
  name: string;
  catno: string;
  entity_type: string;
  entity_type_name: string;
  id: number;
  resource_url: string;
}

export interface DiscogsArtist {
  name: string;
  anv: string;
  join: string;
  role: string;
  tracks: string;
  id: number;
  resource_url: string;
}

export interface DiscogsBasicInformation {
  id: number;
  master_id: number;
  master_url: string;
  resource_url: string;
  thumb: string;
  cover_image: string;
  title: string;
  year: number;
  formats: DiscogsFormat[];
  labels: DiscogsLabel[];
  artists: DiscogsArtist[];
  genres: string[];
  styles: string[];
}

export interface DiscogsRelease {
  id: number;
  instance_id: number;
  date_added: string;
  rating: number;
  basic_information: DiscogsBasicInformation;
}

export interface DiscogsCollectionResponse {
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    items: number;
    urls: {
      last?: string;
      next?: string;
    };
  };
  releases: DiscogsRelease[];
}