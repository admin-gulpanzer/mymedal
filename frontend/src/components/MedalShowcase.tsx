import React, { useState, useCallback } from 'react';
import MedalCard from './MedalCard';
import AddMedalButton from './AddMedalButton';
import MedalModal from './MedalModal';

interface Medal {
  id: string;
  name: string;
  date: string;
  distance: string;
  time: string;
  location?: string;
  notes?: string;
  verified?: boolean;
}

interface Race {
  id: number;
  name: string;
  description?: string;
  date: string;
  location?: string;
  distance?: string;
  race_type?: string;
  total_medals_claimed?: number;
}

interface MedalShowcaseProps {
  medals?: Medal[];
  races?: Race[];
}

const MedalShowcase: React.FC<MedalShowcaseProps> = ({ medals = [], races = [] }) => {
  const [selectedMedal, setSelectedMedal] = useState<Medal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback((medal: Medal) => {
    setSelectedMedal(medal);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedMedal(null);
    }, 100);
  }, []);

  // Convert races to medal format for display
  const displayMedals = races.map(race => ({
    id: race.id.toString(),
    name: race.name,
    date: new Date(race.date).toLocaleDateString(),
    distance: race.distance || '',
    time: '', // No time data for now
    location: race.location || '',
    notes: race.description || '',
    verified: true
  }));

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center pt-20">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-full bg-transparent flex items-center justify-center">
          <div className="relative w-full h-full bg-transparent">
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-white text-2xl md:text-3xl lg:text-4xl font-bold opacity-100 z-10">
              My Medals
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 md:gap-16 
                           justify-items-center items-start relative z-30 mt-24 sm:mt-28 md:mt-32 
                           w-full px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 
                           max-w-7xl mx-auto">
              {displayMedals.map((medal) => (
                <MedalCard
                  key={medal.id}
                  medal={medal}
                  onClick={openModal}
                />
              ))}
              <AddMedalButton races={races} />
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && selectedMedal && (
        <MedalModal
          medal={selectedMedal}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default MedalShowcase;
