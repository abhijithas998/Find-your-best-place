import React from 'react';
import { Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const PlacesList = ({ places, onSelectPlace }) => {
    if (places.length === 0) {
        return (
            <div className="text-center text-gray-500 py-10">
                No places found for this mood.
            </div>
        );
    }

    return (
        <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
            {places.map((place, index) => (
                <motion.div
                    key={place.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => onSelectPlace(place)}
                    className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                >
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-lg text-gray-800">{place.name}</h3>
                        <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-lg">
                            <Star size={14} className="text-yellow-600 fill-yellow-600 mr-1" />
                            <span className="text-xs font-bold text-yellow-700">{place.rating}</span>
                        </div>
                    </div>

                    <div className="mt-2 text-sm text-gray-500 space-y-1">
                        <div className="flex items-center">
                            <MapPin size={14} className="mr-2 text-gray-400" />
                            <span className="truncate">{place.vicinity}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <Clock size={14} className="mr-2 text-gray-400" />
                                <span className={place.opening_hours?.open_now ? "text-green-600 font-medium" : "text-red-500"}>
                                    {place.opening_hours?.open_now ? "Open Now" : "Closed"}
                                </span>
                            </div>
                            <div className="flex items-center text-gray-400">
                                {[...Array(place.price_level || 1)].map((_, i) => (
                                    <DollarSign key={i} size={12} />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default PlacesList;
