import React, { useState } from 'react';
import { LoadScript } from '@react-google-maps/api';
import ProfileList from './components/ProfileList';
import Map from './components/Map';
import AdminPanel from './components/AdminPanel';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import { validateProfile, handleApiError } from './utils/validation';

function App() {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [error, setError] = useState(null);

  const handleError = (error) => {
    const { title, message } = handleApiError(error);
    setError({ title, message });
  };

  const handleAddProfile = async (newProfile) => {
    try {
      // Validate profile data
      const { isValid, errors } = validateProfile(newProfile);
      if (!isValid) {
        throw new Error(Object.values(errors)[0]);
      }

      setProfiles(prev => [...prev, { ...newProfile, id: Date.now() }]);
    } catch (error) {
      handleError(error);
    }
  };

  const handleEditProfile = async (updatedProfile) => {
    try {
      // Validate profile data
      const { isValid, errors } = validateProfile(updatedProfile);
      if (!isValid) {
        throw new Error(Object.values(errors)[0]);
      }

      setProfiles(prev => 
        prev.map(profile => profile.id === updatedProfile.id ? updatedProfile : profile)
      );
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteProfile = (profileId) => {
    try {
      setProfiles(prev => prev.filter(profile => profile.id !== profileId));
      if (selectedProfile?.id === profileId) {
        setSelectedProfile(null);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <ErrorBoundary>
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        onError={(error) => handleError(error)}
      >
        <div className="min-h-screen bg-gray-50/50">
          {/* Header */}
          <header className="bg-white border-b border-gray-200/80 sticky top-0 z-50 backdrop-blur-sm bg-white/80">
            <div className="max-w-7xl mx-auto">
              <div className="px-4 sm:px-6 lg:px-8 py-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Profile Map App
                </h1>
              </div>
              <div className="px-4 sm:px-6 lg:px-8">
                <nav className="flex gap-4 -mb-px">
                  <button
                    onClick={() => setCurrentTab(0)}
                    className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 ${
                      currentTab === 0
                        ? 'text-blue-600 border-blue-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Profiles
                  </button>
                  <button
                    onClick={() => setCurrentTab(1)}
                    className={`px-4 py-2 font-medium transition-all duration-200 border-b-2 ${
                      currentTab === 1
                        ? 'text-blue-600 border-blue-600'
                        : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Admin Panel
                  </button>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {currentTab === 0 ? (
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 min-w-0">
                  <ProfileList
                    profiles={profiles}
                    onProfileSelect={setSelectedProfile}
                  />
                </div>
                <div className="lg:flex-1 lg:sticky lg:top-24 h-[calc(100vh-8rem)]">
                  <Map
                    selectedProfile={selectedProfile}
                    onError={handleError}
                  />
                </div>
              </div>
            ) : (
              <AdminPanel
                profiles={profiles}
                onAddProfile={handleAddProfile}
                onEditProfile={handleEditProfile}
                onDeleteProfile={handleDeleteProfile}
              />
            )}
          </main>

          {/* Error Toast */}
          {error && (
            <Toast
              type="error"
              message={error.message}
              onClose={() => setError(null)}
            />
          )}
        </div>
      </LoadScript>
    </ErrorBoundary>
  );
}

export default App;
