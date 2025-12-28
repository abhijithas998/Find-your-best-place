import axios from 'axios';

const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/search';

export const searchLocation = async (query) => {
    if (!query) return null;

    try {
        const response = await axios.get(NOMINATIM_API_URL, {
            params: {
                q: query,
                format: 'json',
                limit: 1,
                addressdetails: 1,
            },
        });

        if (response.data && response.data.length > 0) {
            const result = response.data[0];
            return {
                lat: parseFloat(result.lat),
                lng: parseFloat(result.lon),
                displayName: result.display_name,
            };
        }
        return null;
    } catch (error) {
        console.error("Error searching location:", error);
        return null;
    }
};
