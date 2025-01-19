import React, { useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoIcon from '@mui/icons-material/Info';
import ProfileSummary from './ProfileSummary';

const ProfileCard = ({ profile, onSelect }) => {
  const [summaryOpen, setSummaryOpen] = useState(false);

  return (
    <>
      <div className="group relative flex-1 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 ease-out hover:-translate-y-1 overflow-hidden border border-gray-100">
        {/* Image Container with Overlay */}
        <div className="relative h-48 sm:h-52 overflow-hidden">
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent z-10" />
          
          {/* Image */}
          <img
            src={profile.photo}
            alt={profile.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          
          {/* Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <h2 className="text-2xl font-bold text-white truncate drop-shadow-sm">
              {profile.name}
            </h2>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-4">
          {/* Description */}
          <p className="text-base text-gray-600 leading-relaxed line-clamp-2">
            {profile.description}
          </p>

          {/* Location */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 transition-colors group-hover:bg-blue-50/50 group-hover:border-blue-100">
            <div className="p-2 rounded-full bg-blue-500/10 transition-colors group-hover:bg-blue-500/20">
              <LocationOnIcon className="text-blue-600 text-xl" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-500 font-medium">Location</p>
              <p className="text-base text-gray-900 truncate">
                {profile.address}
              </p>
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Interests
              </h3>
              <div className="h-px flex-1 bg-gray-100" />
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-[0_4px_12px_rgba(37,99,235,0.2)] cursor-default"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="px-6 pb-6 flex gap-4">
          <button
            onClick={() => onSelect(profile)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-[0_8px_16px_rgba(37,99,235,0.25)] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <LocationOnIcon className="text-xl" />
            <span>View on map</span>
          </button>
          <button
            onClick={() => setSummaryOpen(true)}
            className="min-w-[120px] flex items-center justify-center gap-2 border-2 border-blue-100 text-blue-600 px-5 py-3 rounded-xl font-medium transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <InfoIcon className="text-xl" />
            <span>Summary</span>
          </button>
        </div>
      </div>

      <ProfileSummary
        profile={profile}
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
      />
    </>
  );
};

export default ProfileCard;
