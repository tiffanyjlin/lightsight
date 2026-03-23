const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

/**
 * Search for restaurants/bars matching a text query.
 * Returns the top 5 results with basic info.
 */
export async function searchVenues(query) {
  const params = new URLSearchParams({
    query: `${query} restaurant OR bar`,
    type: 'restaurant|bar',
    key: API_KEY,
  });

  const res = await fetch(`${BASE_URL}/textsearch/json?${params}`);
  if (!res.ok) throw new Error('Places search failed');

  const data = await res.json();
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    throw new Error(data.error_message ?? `Places API error: ${data.status}`);
  }

  return (data.results ?? []).slice(0, 5).map((place) => ({
    placeId: place.place_id,
    name: place.name,
    address: place.formatted_address ?? '',
    rating: place.rating ?? null,
  }));
}

/**
 * Fetch detailed info for a single venue: up to 5 photo references
 * and up to 5 user reviews.
 */
export async function getVenueDetails(placeId) {
  const params = new URLSearchParams({
    place_id: placeId,
    fields: 'name,formatted_address,photos,reviews',
    key: API_KEY,
  });

  const res = await fetch(`${BASE_URL}/details/json?${params}`);
  if (!res.ok) throw new Error('Place details fetch failed');

  const data = await res.json();
  if (data.status !== 'OK') {
    throw new Error(data.error_message ?? `Details API error: ${data.status}`);
  }

  const result = data.result;

  const photos = (result.photos ?? []).slice(0, 5).map((p) => p.photo_reference);

  const reviews = (result.reviews ?? []).slice(0, 5).map((r) => ({
    text: r.text,
    rating: r.rating,
    author: r.author_name,
  }));

  return { photos, reviews };
}

/**
 * Build a full photo URL from a Places photo reference.
 */
export function getPhotoUrl(photoReference, maxWidth = 800) {
  return `${BASE_URL}/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${API_KEY}`;
}
