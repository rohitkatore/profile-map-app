import React, { useState } from 'react';
import { geocodeAddress, parseInterests } from '../utils/validation';

const AdminPanel = ({ profiles, onAddProfile, onEditProfile, onDeleteProfile }) => {
  const [newProfile, setNewProfile] = useState({
    name: '',
    description: '',
    photo: '',
    address: '',
    interests: []
  });
  const [editingProfile, setEditingProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interestsInput, setInterestsInput] = useState('');

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    const updateState = isEditing ? setEditingProfile : setNewProfile;

    if (name === 'interests') {
      setInterestsInput(value);
      const interestsList = value.split(',').map(item => item.trim()).filter(item => item !== '');
      updateState(prev => ({
        ...prev,
        interests: interestsList
      }));
    } else {
      updateState(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const profileData = editingProfile || newProfile;

      // Geocode the address
      const geocodeResult = await geocodeAddress(profileData.address);
      
      const formattedProfile = {
        ...profileData,
        address: geocodeResult.address,
        location: geocodeResult.location,
        interests: profileData.interests
      };

      if (editingProfile) {
        await onEditProfile(formattedProfile);
        setEditingProfile(null);
      } else {
        await onAddProfile({ ...formattedProfile, id: Date.now() });
        // Clear form after successful submission
        setNewProfile({
          name: '',
          description: '',
          photo: '',
          address: '',
          interests: []
        });
        setInterestsInput('');
      }
    } catch (error) {
      console.error('Error submitting profile:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (profile) => {
    setEditingProfile({
      ...profile,
      interests: Array.isArray(profile.interests) ? profile.interests : []
    });
    setInterestsInput(Array.isArray(profile.interests) ? profile.interests.join(', ') : '');
    setError(null);
  };

  const handleCancel = () => {
    setEditingProfile(null);
    setError(null);
  };

  const getInterestsString = (profile) => {
    const interests = Array.isArray(profile.interests) ? profile.interests : [];
    return interests.join(', ');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {editingProfile ? 'Edit Profile' : 'Add New Profile'}
        </h2>

        {error && (
          <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editingProfile ? editingProfile.name : newProfile.name}
              onChange={(e) => handleInputChange(e, !!editingProfile)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={editingProfile ? editingProfile.description : newProfile.description}
              onChange={(e) => handleInputChange(e, !!editingProfile)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
              required
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={editingProfile ? editingProfile.address : newProfile.address}
              onChange={(e) => handleInputChange(e, !!editingProfile)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter full address"
              required
            />
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-2">
              Photo URL
            </label>
            <input
              type="url"
              id="photo"
              name="photo"
              value={editingProfile ? editingProfile.photo : newProfile.photo}
              onChange={(e) => handleInputChange(e, !!editingProfile)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-2">
              Interests (comma-separated)
            </label>
            <input
              type="text"
              id="interests"
              name="interests"
              value={interestsInput}
              onChange={(e) => handleInputChange(e, !!editingProfile)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Photography, Travel, Cooking"
            />
          </div>

          <div className="flex justify-end gap-4">
            {editingProfile && (
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (editingProfile ? 'Saving...' : 'Adding...') : (editingProfile ? 'Save Changes' : 'Add Profile')}
            </button>
          </div>
        </form>
      </div>

      {profiles.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-6">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Existing Profiles
          </h2>
          <div className="space-y-4">
            {profiles.map(profile => (
              <div
                key={profile.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {profile.photo && (
                    <img 
                      src={profile.photo} 
                      alt={`${profile.name}'s profile`} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{profile.name}</h3>
                    <p className="text-sm text-gray-500">{profile.address}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(profile)}
                    className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteProfile(profile.id)}
                    className="p-2 text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
