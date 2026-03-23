/**
 * Search for restaurants/bars matching a text query via our serverless proxy.
 * Returns the top 5 results with basic info.
 */
export async function searchVenues(query) {
  const params = new URLSearchParams({ query });
  const res = await fetch(`/api/search?${params}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? 'Places search failed');
  }

  return res.json();
}

/**
 * Fetch detailed info for a single venue: photo URLs and user reviews.
 * Photo URLs are fully resolved server-side (no API key needed client-side).
 */
export async function getVenueDetails(placeId) {
  const params = new URLSearchParams({ placeId });
  const res = await fetch(`/api/venue?${params}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? 'Place details fetch failed');
  }

  return res.json();
}
