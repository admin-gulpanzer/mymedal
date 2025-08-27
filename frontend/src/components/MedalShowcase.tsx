import React, { useState, useCallback } from 'react';
import MedalCard from './MedalCard';
import AddMedalButton from './AddMedalButton';
import MedalModal from './MedalModal';
import { useAuth } from '../contexts/AuthContext';

interface Medal {
  id: string;
  race_name: string;
  race_date: string;
  race_distance: string;
  finish_time?: string;
  race_location?: string;
  race_description?: string;
  is_verified?: boolean;
  claimed_at: string;
  full_name?: string;
}

const MedalShowcase: React.FC = () => {
  const [selectedMedal, setSelectedMedal] = useState<Medal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated, isLoading, medals, races, racesLoading } = useAuth();

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

  // Helper function to format time from database
  function formatTime(timeData: any): string {
    if (!timeData) return 'N/A';
    
    // If it's already a string, return as is
    if (typeof timeData === 'string') return timeData;
    
    // If it's an object with hours, minutes, seconds, format it
    if (typeof timeData === 'object' && timeData.hours !== undefined) {
      const hours = timeData.hours || 0;
      const minutes = timeData.minutes || 0;
      const seconds = timeData.seconds || 0;
      
      if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }
    
    // Fallback
    return 'N/A';
  }

  // Convert medals to display format
  const displayMedals = (medals || []).map(medal => ({
    id: medal.id,
    name: medal.race_name,
    date: new Date(medal.race_date).toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }),
    distance: medal.race_distance || '',
    time: formatTime(medal.finish_time),
    location: medal.race_location || '',
    notes: medal.race_description || '',
    verified: medal.is_verified || false
  }));

  // Show loading state while checking authentication or loading races
  if (isLoading || racesLoading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center pt-20">
        <div className="text-white text-xl">
          {isLoading ? 'Loading...' : 'Loading races...'}
        </div>
      </div>
    );
  }

  // Show auth modal if user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center pt-32">
        <div className="text-center max-w-2xl mx-4">
          <div className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Welcome to MyMedal
          </div>
          <div className="text-white text-lg md:text-xl mb-8 opacity-80 leading-relaxed">
            Track your race achievements and build your digital medal collection.
          </div>
        </div>
      </div>
    );
  }

  // Show medal showcase if user is authenticated
  return (
    <div className="w-full min-h-screen bg-black pt-32">
      <div className="w-full flex flex-col items-center">
        <div className="w-full text-center mb-8">
          <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold">
            My Medals
          </h1>
        </div>
        <div className="w-full flex justify-center px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-12 
                         justify-items-center items-start 
                         max-w-6xl w-full pb-16 sm:pb-20 md:pb-24">
            {displayMedals.map((displayMedal, index) => (
              <MedalCard
                key={displayMedal.id}
                medal={displayMedal}
                onClick={() => openModal((medals || [])[index])}
              />
            ))}
            <AddMedalButton races={races || []} />
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
