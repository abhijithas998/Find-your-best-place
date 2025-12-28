import React, { useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { searchLocation } from '../services/geocodingService';

const SearchBar = ({ onLocationSelect }) => {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsSearching(true);
        const result = await searchLocation(query);
        setIsSearching(false);

        if (result) {
            onLocationSelect(result);
            setQuery(''); // Optional: clear or keep query
        } else {
            alert('Location not found');
        }
    };

    const handleCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setIsLocating(false);
                onLocationSelect({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    displayName: 'Current Location'
                });
            },
            (error) => {
                setIsLocating(false);
                console.error(error);
                alert('Unable to retrieve your location');
            }
        );
    };

    return (
        <div className="w-full max-w-md mx-auto mb-4">
            <form onSubmit={handleSearch} className="relative flex items-center gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search city or place..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>

                <button
                    type="submit"
                    disabled={isSearching}
                    className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                </button>

                <button
                    type="button"
                    onClick={handleCurrentLocation}
                    disabled={isLocating}
                    title="Use my location"
                    className="p-2 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                    {isLocating ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} />}
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
