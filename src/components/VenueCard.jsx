import LightingScore from './LightingScore';

export default function VenueCard({ venue, onCheckLighting, analysis }) {
  const isLoading = analysis?.loading;
  const hasScore = !!analysis?.result;

  return (
    <article className={`venue-card${hasScore ? ' has-score' : ''}`}>
      <div className="venue-card-body">
        {hasScore && <LightingScore result={analysis.result} />}

        <div className="venue-meta" style={hasScore ? { marginTop: '0.6rem' } : undefined}>
          <h3 className="venue-name">{venue.name}</h3>
          <p className="venue-address">{venue.address}</p>
        </div>

        {analysis?.error && (
          <p className="analysis-error">Could not analyze lighting.</p>
        )}

        {!hasScore && !analysis?.error && (
          <button
            className="check-lighting-btn"
            onClick={() => onCheckLighting(venue)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="btn-spinner" />
                Analyzing…
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="16" height="16" className="btn-icon">
                  <path
                    d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"
                    fill="currentColor"
                  />
                </svg>
                Check Lighting
              </>
            )}
          </button>
        )}
      </div>
    </article>
  );
}
