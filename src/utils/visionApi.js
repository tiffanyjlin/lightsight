/**
 * Send a photo URL to our serverless Vision proxy and get back
 * a brightness score between 0 (very dark) and 1 (very bright).
 */
export async function analyzePhotoBrightness(photoUrl) {
  const params = new URLSearchParams({ photoUrl });
  const res = await fetch(`/api/vision?${params}`);

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? 'Vision API request failed');
  }

  const data = await res.json();
  return data.brightness;
}
