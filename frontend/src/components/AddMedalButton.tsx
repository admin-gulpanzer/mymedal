import React, { useState } from 'react';
import { medalApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface Race {
  id: number;
  name: string;
  description?: string;
  date: string;
  location?: string;
  distance?: string;
  race_type?: string;
}

interface AddMedalButtonProps {
  races?: Race[];
}

const AddMedalButton: React.FC<AddMedalButtonProps> = ({ races = [] }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRace, setSelectedRace] = useState('');
  const [bibNumber, setBibNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const { refreshMedals } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRace || !bibNumber || !fullName) return;

    setLoading(true);
    try {
      await medalApi.claimMedal({
        race_id: parseInt(selectedRace),
        bib_number: bibNumber,
        full_name: fullName,
      });
      
      // Reset form
      setSelectedRace('');
      setBibNumber('');
      setFullName('');
      setShowModal(false);
      
      // Reload page to show new medal
      refreshMedals();
    } catch (error) {
      console.error('Error claiming medal:', error);
      alert('Error claiming medal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
        <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-white text-xl font-bold mb-4">Claim Medal</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Select Race
              </label>
              <select
                value={selectedRace}
                onChange={(e) => setSelectedRace(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                required
              >
                <option value="">Choose a race...</option>
                {races.map((race) => (
                  <option key={race.id} value={race.id}>
                    {race.name} - {new Date(race.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Bib Number
              </label>
              <input
                type="text"
                value={bibNumber}
                onChange={(e) => setBibNumber(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                placeholder="Enter your bib number"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                placeholder="Enter your full name"
                required
              />
            </div>
            
            <div className="flex gap-3 mt-10">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Claiming...' : 'Claim Medal'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div 
      onClick={() => setShowModal(true)}
      className="bg-transparent border-2 border-white/30 rounded-2xl p-6 
                 transition-all duration-300 ease-in-out cursor-pointer
                 hover:border-white/50 hover:-translate-y-1
                 w-full max-w-[320px] flex items-center justify-center
                 min-h-[400px]"
    >
      <div className="flex flex-col items-center gap-2 bg-transparent border-none p-0">
        <span className="text-4xl sm:text-5xl text-white/70 font-bold mb-2">+</span>
        <p className="m-0 text-white/70 text-sm sm:text-base font-medium">Add Medal</p>
      </div>
    </div>
  );
};

export default AddMedalButton;
