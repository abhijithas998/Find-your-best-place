import axios from 'axios';

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

// Helper to generate consistent pseudo-random rating based on ID
const getRating = (id) => {
    const num = parseInt(id.replace(/\D/g, '').slice(-3) || '500');
    return (3.5 + (num % 15) / 10).toFixed(1); // 3.5 to 5.0
};

// Helper to check if open (simulated as OSM opening_hours parsing is complex)
const getOpenStatus = () => {
    return Math.random() > 0.2; // 80% chance open
};

const MOOD_QUERIES = {
    work: `
    node["amenity"~"cafe|library"](around:2000, 37.7749, -122.4194);
    node["office"="coworking"](around:2000, 37.7749, -122.4194);
  `,
    date: `
    node["amenity"~"restaurant|bar"](around:2000, 37.7749, -122.4194);
    node["leisure"="park"](around:2000, 37.7749, -122.4194);
  `,
    quick_bite: `
    node["amenity"="fast_food"](around:2000, 37.7749, -122.4194);
    node["shop"="bakery"](around:2000, 37.7749, -122.4194);
  `,
    budget: `
    node["amenity"="fast_food"](around:2000, 37.7749, -122.4194);
  `
};

export const getPlaces = async (mood, lat, lng) => {
    if (!mood) return [];

    // Default to San Francisco if no coords provided
    const centerLat = lat || 37.7749;
    const centerLng = lng || -122.4194;

    const queryBody = MOOD_QUERIES[mood] || MOOD_QUERIES.work;

    // Replace placeholder coords with actual ones
    const dynamicQueryBody = queryBody.replace(/37\.7749, -122\.4194/g, `${centerLat}, ${centerLng}`);

    const query = `
    [out:json][timeout:25];
    (
      ${dynamicQueryBody}
    );
    out body 20;
    >;
    out skel qt;
  `;

    try {
        const response = await axios.post(OVERPASS_API_URL, query, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const elements = response.data.elements.filter(el => el.tags && el.tags.name);

        return elements.map(el => ({
            id: el.id.toString(),
            name: el.tags.name,
            rating: getRating(el.id.toString()),
            user_ratings_total: Math.floor(Math.random() * 500) + 10,
            vicinity: el.tags['addr:street'] ? `${el.tags['addr:housenumber'] || ''} ${el.tags['addr:street']}` : 'Nearby',
            geometry: {
                location: {
                    lat: el.lat,
                    lng: el.lon
                }
            },
            opening_hours: { open_now: getOpenStatus() },
            types: [el.tags.amenity || el.tags.leisure || 'place'],
            price_level: Math.floor(Math.random() * 3) + 1,
        }));

    } catch (error) {
        console.error("Error fetching from Overpass:", error);
        return [];
    }
};
