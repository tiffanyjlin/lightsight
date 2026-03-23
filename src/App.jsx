import { useState } from 'react';
import SearchBar from './components/SearchBar';
import VenueCard from './components/VenueCard';
import { searchVenues, getVenueDetails, getPhotoUrl } from './utils/placesApi';
import { analyzePhotoBrightness } from './utils/visionApi';
import { calculateLightingScore } from './utils/scoringLogic';
import './App.css';

function SkeletonCard() {
  return (
    <div className="venue-card-skeleton">
      <div className="skeleton-line title" />
      <div className="skeleton-line address" />
      <div className="skeleton-line button" />
    </div>
  );
}

export default function App() {
  const [venues, setVenues] = useState([]);
  const [analyses, setAnalyses] = useState({});
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSearch(query) {
    setSearchLoading(true);
    setError(null);
    setAnalyses({});
    try {
      const results = await searchVenues(query);
      setVenues(results);
      if (results.length === 0) {
        setError('No venues found. Try a different search.');
      }
    } catch {
      setError('Search failed — check your API key and try again.');
      setVenues([]);
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleCheckLighting(venue) {
    setAnalyses((prev) => ({
      ...prev,
      [venue.placeId]: { loading: true },
    }));

    try {
      const details = await getVenueDetails(venue.placeId);

      const brightnessPromises = details.photos.map((ref) =>
        analyzePhotoBrightness(getPhotoUrl(ref))
      );
      const brightnessValues = await Promise.all(brightnessPromises);

      const result = calculateLightingScore(brightnessValues, details.reviews);

      setAnalyses((prev) => ({
        ...prev,
        [venue.placeId]: { result, loading: false },
      }));
    } catch {
      setAnalyses((prev) => ({
        ...prev,
        [venue.placeId]: { error: true, loading: false },
      }));
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <svg viewBox="0 0 24 24" width="26" height="26" className="logo-icon">
            <path
              d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"
              fill="currentColor"
            />
            <circle cx="12" cy="9" r="3.5" fill="rgba(245,197,24,0.25)" />
          </svg>
          <h1>LightSight</h1>
        </div>
        <p className="tagline">Discover the vibe before you arrive</p>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} isLoading={searchLoading} />

        {error && <p className="error-message">{error}</p>}

        {searchLoading && (
          <div className="venue-list">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {!searchLoading && venues.length > 0 && (
          <section className="venue-list">
            {venues.map((venue) => (
              <VenueCard
                key={venue.placeId}
                venue={venue}
                onCheckLighting={handleCheckLighting}
                analysis={analyses[venue.placeId]}
              />
            ))}
          </section>
        )}

        {!searchLoading && venues.length === 0 && !error && (
          <div className="empty-state">
            <svg viewBox="0 0 24 24" width="44" height="44" className="empty-icon">
              <path
                d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
            <h2>Rate the ambiance</h2>
            <p>Search for a restaurant or bar to evaluate its lighting</p>
          </div>
        )}
      </main>
    </div>
  );
}
