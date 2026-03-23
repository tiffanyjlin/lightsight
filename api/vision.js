const API_KEY = process.env.GOOGLE_API_KEY;
const ENDPOINT = 'https://vision.googleapis.com/v1/images:annotate';

export default async function handler(req, res) {
  const { photoUrl } = req.query;

  if (!photoUrl) {
    return res.status(400).json({ error: 'Missing "photoUrl" parameter' });
  }

  const body = {
    requests: [
      {
        image: { source: { imageUri: photoUrl } },
        features: [{ type: 'IMAGE_PROPERTIES' }],
      },
    ],
  };

  const response = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return res.status(502).json({ error: 'Vision API request failed' });
  }

  const data = await response.json();
  const colors =
    data.responses?.[0]?.imagePropertiesAnnotation?.dominantColors?.colors ?? [];

  if (colors.length === 0) {
    return res.status(200).json({ brightness: 0.5 });
  }

  let weightedLuminance = 0;
  let totalFraction = 0;

  for (const entry of colors) {
    const r = (entry.color?.red ?? 0) / 255;
    const g = (entry.color?.green ?? 0) / 255;
    const b = (entry.color?.blue ?? 0) / 255;

    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const fraction = entry.pixelFraction ?? 0;

    weightedLuminance += luminance * fraction;
    totalFraction += fraction;
  }

  const brightness = totalFraction === 0
    ? 0.5
    : Math.min(1, Math.max(0, weightedLuminance / totalFraction));

  return res.status(200).json({ brightness });
}
