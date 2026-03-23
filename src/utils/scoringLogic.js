const POSITIVE_KEYWORDS = ['bright', 'well-lit', 'good lighting', 'light', 'airy'];
const NEGATIVE_KEYWORDS = ['dark', 'dim', 'candlelit', 'moody', 'cave', 'hard to read'];

const LABELS = {
  1: 'Very Dark',
  2: 'Dim',
  3: 'Moderate',
  4: 'Well-Lit',
  5: 'Bright',
};

/**
 * Combine photo brightness scores (0–1 each) and review texts into
 * a final lighting score from 1–5.
 *
 *   photo component  = average brightness, mapped to 1–5  (weight 70%)
 *   review component = keyword sentiment,  mapped to 1–5  (weight 30%)
 *   final            = round(photo * 0.7 + review * 0.3), clamped 1–5
 *
 * Returns { score, label, photoCount, reviewCount }.
 */
export function calculateLightingScore(brightnessValues, reviews) {
  const photoCount = brightnessValues.length;
  const reviewCount = reviews.length;

  const photoScore = photoCount > 0 ? brightnessToScale(avg(brightnessValues)) : 3;
  const reviewScore = reviewCount > 0 ? reviewSentimentToScale(reviews) : 3;

  const raw = photoScore * 0.7 + reviewScore * 0.3;
  const score = clamp(Math.round(raw), 1, 5);

  return {
    score,
    label: LABELS[score],
    photoCount,
    reviewCount,
  };
}

function brightnessToScale(brightness) {
  // 0 → 1,  0.25 → 2,  0.5 → 3,  0.75 → 4,  1.0 → 5
  return clamp(1 + brightness * 4, 1, 5);
}

function reviewSentimentToScale(reviews) {
  let positiveHits = 0;
  let negativeHits = 0;

  for (const review of reviews) {
    const text = (review.text ?? '').toLowerCase();
    for (const kw of POSITIVE_KEYWORDS) {
      if (text.includes(kw)) positiveHits++;
    }
    for (const kw of NEGATIVE_KEYWORDS) {
      if (text.includes(kw)) negativeHits++;
    }
  }

  const total = positiveHits + negativeHits;
  if (total === 0) return 3;

  // Net ratio from –1 (all negative) to +1 (all positive), mapped to 1–5
  const ratio = (positiveHits - negativeHits) / total;
  return clamp(3 + ratio * 2, 1, 5);
}

function avg(nums) {
  return nums.reduce((sum, n) => sum + n, 0) / nums.length;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
