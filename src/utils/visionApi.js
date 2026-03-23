const API_KEY = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
const ENDPOINT = 'https://vision.googleapis.com/v1/images:annotate';

/**
 * Send a photo to Cloud Vision IMAGE_PROPERTIES and derive a
 * brightness score between 0 (very dark) and 1 (very bright).
 *
 * Brightness is calculated as a pixel-fraction–weighted average
 * of perceived luminance across the dominant colors.
 */
export async function analyzePhotoBrightness(photoUrl) {
  const body = {
    requests: [
      {
        image: { source: { imageUri: photoUrl } },
        features: [{ type: 'IMAGE_PROPERTIES' }],
      },
    ],
  };

  const res = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error('Vision API request failed');

  const data = await res.json();
  const colors =
    data.responses?.[0]?.imagePropertiesAnnotation?.dominantColors?.colors ?? [];

  if (colors.length === 0) return 0.5;

  let weightedLuminance = 0;
  let totalFraction = 0;

  for (const entry of colors) {
    const r = (entry.color?.red ?? 0) / 255;
    const g = (entry.color?.green ?? 0) / 255;
    const b = (entry.color?.blue ?? 0) / 255;

    // ITU-R BT.709 perceived luminance
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    const fraction = entry.pixelFraction ?? 0;

    weightedLuminance += luminance * fraction;
    totalFraction += fraction;
  }

  if (totalFraction === 0) return 0.5;
  return Math.min(1, Math.max(0, weightedLuminance / totalFraction));
}
