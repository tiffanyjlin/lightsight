function Bulb({ filled }) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" className="bulb-icon">
      <path
        d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"
        fill={filled ? '#F5C518' : 'none'}
        stroke={filled ? 'none' : '#333'}
        strokeWidth={filled ? 0 : 1.5}
      />
      {filled && (
        <circle cx="12" cy="9" r="4" fill="rgba(245,197,24,0.2)" />
      )}
    </svg>
  );
}

export default function LightingScore({ result }) {
  const { score, label, photoCount, reviewCount } = result;

  const parts = [];
  if (photoCount > 0) parts.push(`${photoCount} photo${photoCount !== 1 ? 's' : ''}`);
  if (reviewCount > 0) parts.push(`${reviewCount} review${reviewCount !== 1 ? 's' : ''}`);
  const summary = parts.length > 0 ? `Based on ${parts.join(' and ')}` : '';

  return (
    <div className="lighting-score">
      <div className="score-bulbs" role="img" aria-label={`${score} out of 5`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Bulb key={n} filled={n <= score} />
        ))}
      </div>
      <div className="score-details">
        <span className="score-value">{score}/5</span>
        <span className="score-label">{label}</span>
      </div>
      {summary && <p className="score-summary">{summary}</p>}
    </div>
  );
}
