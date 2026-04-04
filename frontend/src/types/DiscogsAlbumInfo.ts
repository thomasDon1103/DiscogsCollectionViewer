export interface Artist {
    name: string;
    anv: string;
    join: string;
    role: string;
    tracks: string;
    id: number;
    resource_url: string;
    thumbnail_url: string;
}

export interface Label {
    name: string;
    catno: string;
    entity_type: number;
    entity_type_name: string;
    id: number;
    resource_url: string;
    thumbnail_url: string;
}

export interface Company {
    name: string;
    catno: string;
    entity_type: number;
    entity_type_name: string;
    id: number;
    resource_url: string;
    thumbnail_url: string;
}

export interface Format {
    name: string;
    qty: number;
    descriptions: string[];
    text: string;
}

export interface Identifier {
    type: string;
    value: string;
    description: string;
}

export interface Video {
    uri: string;
    title: string;
    description: string;
    duration: number;
    embed: boolean;
}

export interface Image {
    type: string;
    uri: string;
    resource_url: string;
    uri150: string;
    width: number;
    height: number;
}

export interface DiscogsAlbumInfoResponse {
    id: number;
    status: string;
    year: number;
    resource_url: string;
    uri: string;
    artists: Artist[];
    artists_sort: string;
    labels: Label[];
    series: any[];
    companies: Company[];
    formats: Format[];
    data_quality: string;
    community: {
        have: number;
        want: number;
        rating: { count: number; average: number };
        submitter: { username: string; resource_url: string };
        contributors: Array<{ username: string; resource_url: string }>;
        data_quality: string;
        status: string;
    };
    format_quantity: number;
    date_added: string;
    date_changed: string;
    num_for_sale: number;
    lowest_price: number;
    master_id: number;
    master_url: string;
    title: string;
    country: string;
    released: string;
    notes: string;
    released_formatted: string;
    identifiers: Identifier[];
    videos: Video[];
    genres: string[];
    styles: string[];
    tracklist: Array<{ position: string; type_: string; title: string; duration: string }>;
    images: Image[];
    thumb: string;
    estimated_weight: number;
    blocked_from_sale: boolean;
    is_offensive: boolean;
}