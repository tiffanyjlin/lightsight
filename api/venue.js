const API_KEY = process.env.GOOGLE_API_KEY;
const BASE_URL = 'https://maps.googleapis.com/maps/api/place';

export default async function handler(req, res) {
  const { placeId } = req.query;

  if (!placeId) {
    return res.status(400).json({ error: 'Missing "placeId" parameter' });
  }

  const params = new URLSearchParams({
    place_id: placeId,
    fields: 'name,formatted_address,photos,reviews',
    key: API_KEY,
  });

  const response = await fetch(`${BASE_URL}/details/json?${params}`);
  const data = await response.json();

  if (data.status !== 'OK') {
    return res.status(502).json({ error: data.error_message ?? `Details API error: ${data.status}` });
  }

  const result = data.result;

  const photoUrls = (result.photos ?? []).slice(0, 5).map((p) => {
    const photoParams = new URLSearchParams({
      maxwidth: '800',
      photoreference: p.photo_reference,
      key: API_KEY,
    });
    return `${BASE_URL}/photo?${photoParams}`;
  });

  const reviews = (result.reviews ?? []).slice(0, 5).map((r) => ({
    text: r.text,
    rating: r.rating,
    author: r.author_name,
  }));

  return res.status(200).json({ photoUrls, reviews });
}
