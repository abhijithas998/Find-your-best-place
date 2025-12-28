import React, { useState, useEffect } from 'react';
import MoodSelector from './components/MoodSelector';
import MapComponent from './components/MapComponent';
import PlacesList from './components/PlacesList';
import SearchBar from './components/SearchBar';
import { getPlaces } from './services/placesService';
import { MapPin } from 'lucide-react';

function App() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState({ lat: 37.7749, lng: -122.4194, displayName: 'San Francisco, CA' });

  // No API Key needed for OpenStreetMap


  useEffect(() => {
    const fetchPlaces = async () => {
      setIsLoading(true);
      try {
        const data = await getPlaces(selectedMood, location.lat, location.lng);
        setPlaces(data);
        // Reset selected place when mood/location changes
        setSelectedPlace(null);
      } catch (error) {
        console.error("Failed to fetch places", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaces();
  }, [selectedMood, location]);

  const handleLocationSelect = (newLocation) => {
    setLocation(newLocation);
    // Reset mood to trigger fresh search or just keep current
  };

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="glass z-20 px-6 py-4 flex flex-col sm:flex-row items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-blue-500/30">
              <MapPin size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              Find what your mind wants
            </h1>
          </div>
        </div>

        <div className="w-full sm:max-w-md">
          <SearchBar onLocationSelect={handleLocationSelect} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 md:min-w-[350px] md:max-w-[450px] glass border-r border-white/20 flex flex-col z-10 h-1/2 md:h-full order-2 md:order-1">
          <div className="p-4 border-b border-slate-100/50">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-slate-700">How are you feeling?</h2>
              <span className="text-xs text-slate-400 truncate max-w-[150px]" title={location.displayName}>
                📍 {location.displayName}
              </span>
            </div>
            <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />
          </div>

          <div className="flex-1 overflow-hidden flex flex-col p-4 bg-white/30">
            <h2 className="text-lg font-semibold mb-3 text-slate-700 flex items-center justify-between">
              <span>{selectedMood ? 'Recommended Places' : 'All Places'}</span>
              <span className="text-xs font-normal text-slate-500 bg-white/50 px-2 py-1 rounded-full">
                {places.length} results
              </span>
            </h2>

            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <PlacesList places={places} onSelectPlace={setSelectedPlace} />
            )}
          </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 relative h-1/2 md:h-full order-1 md:order-2">
          <MapComponent
            places={places}
            selectedPlace={selectedPlace}
            onSelectPlace={setSelectedPlace}
          // Pass center explicitly if needed, or let MapComponent handle it via places/selectedPlace
          // But we might want to center on the searched location initially
          />

          {/* Floating Detail Card */}
          {selectedPlace && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 glass p-4 rounded-2xl w-[90%] max-w-md z-30 animate-in slide-in-from-bottom-10 fade-in duration-300 border border-white/40">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{selectedPlace.name}</h3>
                  <p className="text-slate-500 text-sm">{selectedPlace.vicinity}</p>
                </div>
                <button
                  onClick={() => setSelectedPlace(null)}
                  className="p-1 hover:bg-slate-100 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="px-2 py-1 bg-yellow-100/80 text-yellow-700 text-xs rounded-lg font-bold flex items-center shadow-sm">
                  {selectedPlace.rating} ★
                </span>
                <span className={`px-2 py-1 text-xs rounded-lg font-bold shadow-sm ${selectedPlace.opening_hours?.open_now ? 'bg-green-100/80 text-green-700' : 'bg-red-100/80 text-red-700'}`}>
                  {selectedPlace.opening_hours?.open_now ? 'Open' : 'Closed'}
                </span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
