import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import MedalShowcase from './components/MedalShowcase';

function AppContent() {
  return (
    <div className="App">
      <Header />
      <MedalShowcase />
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

export default App;// Test deployment - Wed Aug 27 13:16:46 IST 2025
// Test after root directory fix - Wed Aug 27 13:39:38 IST 2025
