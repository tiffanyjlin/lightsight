const API_KEY = process.env.GOOGLE_API_KEY;
const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Missing "query" parameter' });
  }

  const params = new URLSearchParams({
    query,
    type: 'establishment',
    location: '40.7128,-74.0060',
    radius: '40000',
    key: API_KEY,
  });

  const response = await fetch(`${BASE_URL}/textsearch/json?${params}`);
  const data = await response.json();

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    return res.status(502).json({ error: data.error_message ?? `Places API error: ${data.status}` });
  }

  const results = (data.results ?? []).slice(0, 20).map((place) => ({
    placeId: place.place_id,
    name: place.name,
    address: place.formatted_address ?? '',
    rating: place.rating ?? null,
  }));

  return res.status(200).json(results);
}
