import React from 'react';
import { Briefcase, Heart, Coffee, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const MOODS = [
    { id: 'work', label: 'Work', icon: Briefcase, color: 'bg-blue-500' },
    { id: 'date', label: 'Date', icon: Heart, color: 'bg-pink-500' },
    { id: 'quick_bite', label: 'Quick Bite', icon: Coffee, color: 'bg-orange-500' },
    { id: 'budget', label: 'Budget', icon: DollarSign, color: 'bg-green-500' },
];

const MoodSelector = ({ selectedMood, onSelectMood }) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 p-4">
            {MOODS.map((mood) => {
                const Icon = mood.icon;
                const isSelected = selectedMood === mood.id;

                return (
                    <motion.button
                        key={mood.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelectMood(mood.id)}
                        className={clsx(
                            "flex flex-col items-center justify-center p-4 rounded-2xl shadow-md transition-colors w-28 h-28",
                            isSelected ? `${mood.color} text-white` : "bg-white text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        <Icon size={32} className="mb-2" />
                        <span className="font-medium text-sm">{mood.label}</span>
                    </motion.button>
                );
            })}
        </div>
    );
};

export default MoodSelector;
