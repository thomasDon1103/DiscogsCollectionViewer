import type { DiscogsCollectionResponse } from '../types/Discogs';

const DISCOGS_API_BASE = 'https://api.discogs.com';

export const discogsService = {
  /**
   * Fetch a single page of a user's Discogs collection.
   */
  async fetchCollectionPage(
    username: string,
    page: number = 1,
    apiKey?: string,
  ): Promise<DiscogsCollectionResponse> {
    if (!username) {
      throw new Error('Username is required');
    }

    const url = new URL(
      `${DISCOGS_API_BASE}/users/${encodeURIComponent(username)}/collection/folders/0/releases`,
    );
    url.searchParams.set('page', String(page));
    url.searchParams.set('per_page', '100');
    url.searchParams.set('sort', 'artist');
    url.searchParams.set('sort_order', 'asc');

    const headers: Record<string, string> = {
      'User-Agent': 'DiscogsCollectionApp/1.0',
    };

    if (apiKey) {
      headers['Authorization'] = `Discogs token=${apiKey}`;
    }

    const response = await fetch(url.toString(), { headers });

    if (!response.ok) {
      const body = await response.text();
      let detail = '';
      try {
        const json = JSON.parse(body);
        detail = json.message || body;
      } catch {
        detail = body;
      }
      throw new Error(
        `Failed to fetch collection (HTTP ${response.status}): ${detail}`,
      );
    }

    return (await response.json()) as DiscogsCollectionResponse;
  },
};

export default discogsService;