import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import MedalShowcase from './components/MedalShowcase';

function AppContent() {
  const [races, setRaces] = useState<any[]>([]);
  const [medals, setMedals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('Loading races from API...');
        
        const response = await fetch('http://localhost:3001/api/races');
        if (response.ok) {
          const racesData = await response.json();
          console.log('Loaded races:', racesData);
          setRaces(racesData);
        } else {
          console.warn('API not available, using mock data');
          setRaces([
            { id: 1, name: 'Boston Marathon 2024', location: 'Boston, MA', distance: '26.2 miles', date: '2024-04-15' },
            { id: 2, name: 'NYC Half Marathon 2024', location: 'New York, NY', distance: '13.1 miles', date: '2024-03-17' }
          ]);
        }
      } catch (error) {
        console.error('Error loading races:', error);
        setRaces([
          { id: 1, name: 'Boston Marathon 2024', location: 'Boston, MA', distance: '26.2 miles', date: '2024-04-15' },
          { id: 2, name: 'NYC Half Marathon 2024', location: 'New York, NY', distance: '13.1 miles', date: '2024-03-17' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="App">
        <Header />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-xl">Loading races...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <MedalShowcase medals={medals} races={races} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;