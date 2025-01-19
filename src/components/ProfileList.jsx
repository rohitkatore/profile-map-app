import React, { useState } from 'react';
import ProfileCard from './ProfileCard';
import SearchFilters from './SearchFilters';

const ProfileList = ({ profiles, onProfileSelect }) => {
  const [filteredProfiles, setFilteredProfiles] = useState(profiles);

  return (
    <div className="space-y-8">
      {/* Search and Filters Section */}
      <div className="sticky top-0 z-40 -mx-6 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200/80">
        <SearchFilters
          profiles={profiles}
          onFilterChange={setFilteredProfiles}
        />
      </div>

      {/* Results Section */}
      <div className="min-h-[calc(100vh-16rem)]">
        {filteredProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 mb-4 rounded-full bg-blue-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 21a9 9 0 110-18 9 9 0 010 18z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              No matches found
            </h3>
            <p className="text-gray-500 text-center max-w-sm">
              Try adjusting your search or filter criteria to find what you're looking for
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6 auto-rows-fr">
            {filteredProfiles.map((profile) => (
              <div key={profile.id} className="flex">
                <ProfileCard
                  profile={profile}
                  onSelect={onProfileSelect}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileList;
