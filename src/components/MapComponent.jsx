import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon in React Leaflet
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng]);
    }, [lat, lng, map]);
    return null;
};

const MapComponent = ({ places, selectedPlace, onSelectPlace }) => {
    // Default center (San Francisco)
    const defaultCenter = [37.7749, -122.4194];

    // Determine map center: selected place > first place > default
    const center = selectedPlace
        ? [selectedPlace.geometry.location.lat, selectedPlace.geometry.location.lng]
        : places.length > 0
            ? [places[0].geometry.location.lat, places[0].geometry.location.lng]
            : defaultCenter;

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden z-0">
            <MapContainer
                center={center}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterAutomatically lat={center[0]} lng={center[1]} />

                {places.map((place) => (
                    <Marker
                        key={place.id}
                        position={[place.geometry.location.lat, place.geometry.location.lng]}
                        eventHandlers={{
                            click: () => onSelectPlace(place),
                        }}
                    >
                        <Popup>
                            <div className="font-semibold">{place.name}</div>
                            <div className="text-xs text-gray-500">{place.vicinity}</div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapComponent;
